function validate_crud_functions(crud, expected)
{
    var actual = dir(crud);

    // Ensures expected functions are on the actual list
    var missing = [];
    for(exp_funct of expected){
        var pos = actual.indexOf(exp_funct);
        if(pos == -1){
            missing.push(exp_funct);
        }
        else{
            actual.splice(pos, 1);
        }
    }

    if(missing.length == 0){
        print ("All expected functions are available\n");
    }
    else{
        print("Missing Functions:", missing);
    }

    if (actual.length == 0){
        print("No additional functions are available\n")
    }
    else{
        print("Extra Functions:", actual);
    }
}

function ensure_schema_does_not_exist(session, name){
	try{
		var schema = session.getSchema(name);
		session.dropSchema(name);
	}
	catch(err){
		// Nothing happens, it means the schema did not exist
	}
}

function validateMember(memberList, member){
	if (memberList.indexOf(member) != -1){
		print(member + ": OK\n");
	}
	else{
		print(member + ": Missing\n");
	}
}

function validateNotMember(memberList, member){
	if (memberList.indexOf(member) != -1){
		print(member + ": Unexpected\n");
	}
	else{
		print(member + ": OK\n");
	}
}

function getSchemaFromList(schemas, name){
  for(index in schemas){
    if(schemas[index].name == name)
      return schemas[index];
  }

  return null;
}

function wait(timeout, wait_interval, condition){
  waiting = 0;
  res = condition();
  while(!res && waiting < timeout) {
    os.sleep(wait_interval);
    waiting = waiting + 1;
    res = condition();
  }
  return res;
}


var ro_session;
var ro_module = require('mysql');
function wait_super_read_only_done() {
  var super_read_only = ro_session.runSql('select @@super_read_only').fetchOne()[0];

  println("---> Super Read Only = " + super_read_only);

  return super_read_only == "0";
}

function check_super_read_only_done(connection) {
  ro_session = ro_module.getClassicSession(connection);
  wait(60, 1, wait_super_read_only_done);
  ro_session.close();
}

var recov_cluster;
var recov_slave_name;
var recov_state_list;

function _check_slave_state() {
  var full_status = recov_cluster.status();
  var slave_status = full_status.defaultReplicaSet.topology[recov_slave_name].status;

  println("--->" + recov_slave_name + ": " + slave_status);

  ret_val = false
  for(state in recov_state_list){
    if (recov_state_list[state] == slave_status) {
      ret_val = true;
      println ("Done!");
      break;
    }
  }

  return ret_val;
}

function wait_slave_state(cluster, slave_uri, states) {
  recov_cluster = cluster;
  recov_slave_name = slave_uri;

  if (type(states) == "Array")
    recov_state_list = states;
  else
    recov_state_list = [states];

  println ("WAITING for " + slave_uri + " to be in one of these states: " + states);

  wait(60, 1, _check_slave_state);

  recov_cluster = null;
}

function connect_to_sandbox(port) {
  var connected = false;
  try {
    shell.connect({scheme: 'mysql', user:'root', password:'root', host:'localhost', port:port})
    connected = true;
  } catch (err) {
    println('failed connecting to sandbox at ' + port + ': ' + err.message);
  }

  return connected;
}

function start_sandbox(port) {
  var started = false;

  options = {}
  if (__sandbox_dir != '')
    options['sandboxDir'] = __sandbox_dir;

  print('Starting sandbox at: ' + port);
  started = wait(10, 1, function() {
    try {
      dba.startSandboxInstance(port, options);

      println('succeeded');
      return true;
    } catch (err) {
      println('failed: ' + err.message);
      return false;
    }
  });

  return started;
}

// Smart deployment routines
function reset_or_deploy_sandbox(port, retry) {
  var deployed_here = false;

  if (typeof retry == 'undefined')
    retry = true;

  //  Checks for the sandbox being already deployed
  var connected = connect_to_sandbox(port);

  // If it is already part of a cluster, a reboot will be required
  var reboot = false;
  if (connected) {
    try {
      var c = dba.getCluster();
      reboot = true;
    } catch(err) {
      println('unable to get cluster from sandbox at ' + port + ': ' + err.message);

      // Reboot is required if it is not a standalone instance
      if (err.message.indexOf("This function is not available through a session to a standalone instance") == -1)
        reboot = true;
    }
  }

  options = {}
  if (__sandbox_dir != '')
    options['sandboxDir'] = __sandbox_dir;

  if (reboot) {
    connected = false;

    println('Killing sandbox at: ' + port);
    try {dba.killSandboxInstance(port, options);} catch (err) {}

    var started = start_sandbox(port);
    if (started)
      connected = connect_to_sandbox(port);
  }

  // No matter what, we get rid of the metadata schema
  if (connected) {
    print('Dropping metadata...');
    session.runSql('set sql_log_bin = 0');
    session.runSql('drop schema if exists mysql_innodb_cluster_metadata');
    session.runSql('flush logs');
    session.runSql('set sql_log_bin = 1');
    session.close();
  } else {
    println('Deploying instance');
    options['password'] = 'root';
    options['allowRootFrom'] = '%';

    try {
      dba.deploySandboxInstance(port, options);
      deployed_here = true;
    } catch(err) {
      var non_empty_dir = err.message.indexOf("is not empty") != -1;
      println ("Failure deploying!" + retry + non_empty_dir)

      if (retry &&
        non_empty_dir &&
          start_sandbox(port)) {
        deployed_here = reset_or_deploy_sandbox(port, false);
      } else {
        throw err;
      }
    }
  }

  return deployed_here;
}

function reset_or_deploy_sandboxes() {
  var deploy1 = reset_or_deploy_sandbox(__mysql_sandbox_port1);
  var deploy2 = reset_or_deploy_sandbox(__mysql_sandbox_port2);
  var deploy3 = reset_or_deploy_sandbox(__mysql_sandbox_port3);

  return deploy1 || deploy2 || deploy3;
}

function cleanup_sandbox(port) {
  options = {}
  if (__sandbox_dir != '')
    options['sandboxDir'] = __sandbox_dir;

  dba.killSandboxInstance(port, options);
  dba.deleteSandboxInstance(port, options);
}

function cleanup_sandboxes(deployed_here) {
  if (deployed_here) {
    cleanup_sandbox(__mysql_sandbox_port1);
    cleanup_sandbox(__mysql_sandbox_port2);
    cleanup_sandbox(__mysql_sandbox_port3);
  }
}

  // Operation that retries adding an instance to a cluster
  // 3 retries are done on each case, expectation is that the addition
  // is done on the first attempt, however, we have detected some OS
  // delays that cause it to fail, that's why the retry logic
function add_instance_to_cluster(cluster, port, label) {
  add_instance_options['port'] = port;

  var labeled = false;
  if (typeof label != 'undefined') {
    add_instance_extra_opts['label'] = label;
    labeled = true;
  }

  attempt = 0;
  success = false;
  while (attempt < 3 && !success) {
    try {
      cluster.addInstance(add_instance_options, add_instance_extra_opts);
      println("Instance added successfully...")
      success = true;
    } catch (err) {
      if (err.message.indexOf("The server is not configured properly to be an active member of the group.") == -1) {
        attempt = attempt + 1;
        println("Failed adding instance on attempt " + attempt);
        println(err);
        println("Waiting 5 seconds for next attempt");
        os.sleep(5)
      }
      else
        throw(err);
    }
  }

  if (labeled)
    delete add_instance_extra_opts['label'];

  if (!success)
    throw ('Failed adding instance : ' + add_instance_options + ',' + add_instance_extra_opts);
}

// Function to cleanup (if deployed) or reset the sandbox.
function cleanup_or_reset_sandbox(port, deployed) {
  if (deployed) {
      cleanup_sandbox(port);
  } else {
      reset_or_deploy_sandbox(port);
  }
}

// Function to restart the server (after being stopped).
function try_restart_sandbox(port) {
  var started = false;

  options = {}
  if (__sandbox_dir != '')
    options['sandboxDir'] = __sandbox_dir;

  print('Try starting sandbox at: ' + port);
  started = wait(10, 1, function() {
      try {
          dba.startSandboxInstance(port, options);

          println(' succeeded');
          return true;
      } catch (err) {
          println(' failed: ' + err.message);
          return false;
      }
  });
  if (started) {
    println('Restart succeeded at: ' + port);
  } else {
    println('Restart failed at: ' + port);
  }
}
