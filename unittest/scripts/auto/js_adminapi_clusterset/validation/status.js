//@<OUT> Plain
{
    "clusters": {
        "cluster1": {
            "clusterRole": "PRIMARY",
            "globalStatus": "OK",
            "primary": "<<<hostname>>>:<<<__mysql_sandbox_port1>>>"
        },
        "cluster2": {
            "clusterRole": "REPLICA",
            "clusterSetReplicationStatus": "OK",
            "globalStatus": "OK"
        },
        "cluster3": {
            "clusterRole": "REPLICA",
            "clusterSetReplicationStatus": "OK",
            "globalStatus": "OK"
        }
    },
    "domainName": "cs",
    "globalPrimaryInstance": "<<<hostname>>>:<<<__mysql_sandbox_port1>>>",
    "primaryCluster": "cluster1",
    "status": "HEALTHY",
    "statusText": "All Clusters available."
}

//@<OUT> describe()
{
    "clusters": {
        "cluster1": {
            "clusterRole": "PRIMARY",
            "topology": [
                {
                    "address": "<<<__address1h>>>",
                    "label": "<<<__address1h>>>",
                    "role": "HA"
                }
            ]
        },
        "cluster2": {
            "clusterRole": "REPLICA",
            "topology": [
                {
                    "address": "<<<__address4h>>>",
                    "label": "<<<__address4h>>>",
                    "role": "HA"
                },
                {
                    "address": "<<<__address5h>>>",
                    "label": "<<<__address5h>>>",
                    "role": "HA"
                }
            ]
        },
        "cluster3": {
            "clusterRole": "REPLICA",
            "topology": [
                {
                    "address": "<<<__address6h>>>",
                    "label": "<<<__address6h>>>",
                    "role": "HA"
                }
            ]
        }
    },
    "domainName": "cs",
    "primaryCluster": "cluster1"
}

//@<OUT> Extended 1
{
    "clusters": {
        "cluster1": {
            "clusterRole": "PRIMARY",
            "globalStatus": "OK",
            "primary": "<<<hostname>>>:<<<__mysql_sandbox_port1>>>",
            "status": "OK_NO_TOLERANCE",
            "statusText": "Cluster is NOT tolerant to any failures.",
            "topology": {
                "<<<hostname>>>:<<<__mysql_sandbox_port1>>>": {
                    "address": "<<<hostname>>>:<<<__mysql_sandbox_port1>>>",
                    "memberRole": "PRIMARY",
                    "mode": "R/W",
                    "readReplicas": {},
                    "role": "HA",
                    "status": "ONLINE",
                    "version": "[[*]]"
                }
            },
            "transactionSet": "[[*]]"
        },
        "cluster2": {
            "clusterRole": "REPLICA",
            "clusterSetReplication": {
                "applierStatus": "APPLIED_ALL",
                "applierThreadState": "Waiting for an event from Coordinator",
                "applierWorkerThreads": 4,
                "receiver": "<<<hostname>>>:<<<__mysql_sandbox_port4>>>",
                "receiverStatus": "ON",
                "receiverThreadState": "Waiting for source to send event",
                "replicationSsl": "TLS_[[*]]",
                "replicationSslMode": "REQUIRED",
                "source": "<<<hostname>>>:<<<__mysql_sandbox_port1>>>"
            },
            "clusterSetReplicationStatus": "OK",
            "globalStatus": "OK",
            "status": "OK_NO_TOLERANCE",
            "statusText": "Cluster is NOT tolerant to any failures.",
            "topology": {
                "<<<hostname>>>:<<<__mysql_sandbox_port4>>>": {
                    "address": "<<<hostname>>>:<<<__mysql_sandbox_port4>>>",
                    "memberRole": "PRIMARY",
                    "mode": "R/O",
                    "readReplicas": {},
                    "replicationLagFromImmediateSource": "",
                    "replicationLagFromOriginalSource": "",
                    "role": "HA",
                    "status": "ONLINE",
                    "version": "[[*]]"
                },
                "<<<hostname>>>:<<<__mysql_sandbox_port5>>>": {
                    "address": "<<<hostname>>>:<<<__mysql_sandbox_port5>>>",
                    "memberRole": "SECONDARY",
                    "mode": "R/O",
                    "readReplicas": {},
                    "replicationLagFromImmediateSource": "",
                    "replicationLagFromOriginalSource": "",
                    "role": "HA",
                    "status": "ONLINE",
                    "version": "[[*]]"
                }
            },
            "transactionSet": "[[*]]",
            "transactionSetConsistencyStatus": "OK",
            "transactionSetErrantGtidSet": "",
            "transactionSetMissingGtidSet": ""
        },
        "cluster3": {
            "clusterRole": "REPLICA",
            "clusterSetReplication": {
                "applierStatus": "APPLIED_ALL",
                "applierThreadState": "Waiting for an event from Coordinator",
                "applierWorkerThreads": 4,
                "receiver": "<<<hostname>>>:<<<__mysql_sandbox_port6>>>",
                "receiverStatus": "ON",
                "receiverThreadState": "Waiting for source to send event",
                "replicationSsl": "TLS_[[*]]",
                "replicationSslMode": "REQUIRED",
                "source": "<<<hostname>>>:<<<__mysql_sandbox_port1>>>"
            },
            "clusterSetReplicationStatus": "OK",
            "globalStatus": "OK",
            "status": "OK_NO_TOLERANCE",
            "statusText": "Cluster is NOT tolerant to any failures.",
            "topology": {
                "<<<hostname>>>:<<<__mysql_sandbox_port6>>>": {
                    "address": "<<<hostname>>>:<<<__mysql_sandbox_port6>>>",
                    "memberRole": "PRIMARY",
                    "mode": "R/O",
                    "readReplicas": {},
                    "replicationLagFromImmediateSource": "",
                    "replicationLagFromOriginalSource": "",
                    "role": "HA",
                    "status": "ONLINE",
                    "version": "[[*]]"
                }
            },
            "transactionSet": "[[*]]",
            "transactionSetConsistencyStatus": "OK",
            "transactionSetErrantGtidSet": "",
            "transactionSetMissingGtidSet": ""
        }
    },
    "domainName": "cs",
    "globalPrimaryInstance": "<<<hostname>>>:<<<__mysql_sandbox_port1>>>",
    "metadataServer": "<<<hostname>>>:<<<__mysql_sandbox_port1>>>",
    "primaryCluster": "cluster1",
    "status": "HEALTHY",
    "statusText": "All Clusters available."
}


//@<OUT> describe with invalidated cluster
{
    "clusters": {
        "cluster1": {
            "clusterRole": "PRIMARY",
            "topology": [
                {
                    "address": "<<<__address1h>>>",
                    "label": "<<<__address1h>>>",
                    "role": "HA"
                }
            ]
        },
        "cluster2": {
            "clusterRole": "REPLICA",
            "invalidated": true,
            "topology": [
                {
                    "address": "<<<__address4h>>>",
                    "label": "<<<__address4h>>>",
                    "role": "HA"
                },
                {
                    "address": "<<<__address5h>>>",
                    "label": "<<<__address5h>>>",
                    "role": "HA"
                }
            ]
        },
        "cluster3": {
            "clusterRole": "REPLICA",
            "topology": [
                {
                    "address": "<<<__address6h>>>",
                    "label": "<<<__address6h>>>",
                    "role": "HA"
                }
            ]
        }
    },
    "domainName": "cs",
    "primaryCluster": "cluster1"
}
