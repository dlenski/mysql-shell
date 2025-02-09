/*
 * Copyright (c) 2023, Oracle and/or its affiliates.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2.0,
 * as published by the Free Software Foundation.
 *
 * This program is also distributed with certain software (including
 * but not limited to OpenSSL) that is licensed under separate terms, as
 * designated in a particular file or component or in included license
 * documentation.  The authors of MySQL hereby grant you an additional
 * permission to link the program and your derivative works with the
 * separately licensed software that they have included with MySQL.
 * This program is distributed in the hope that it will be useful,  but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See
 * the GNU General Public License, version 2.0, for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA
 */

#include "modules/adminapi/base_cluster.h"
#include "modules/adminapi/common/accounts.h"
#include "mysqlshdk/include/shellcore/utils_help.h"
#include "mysqlshdk/libs/utils/utils_json.h"

namespace mysqlsh {
namespace dba {

shcore::Value Base_cluster::get_member(const std::string &prop) const {
  shcore::Value ret_val;

  // Throw an error if the cluster has already been dissolved
  assert_valid(prop);

  if (prop == "name")
    ret_val = shcore::Value(base_impl()->get_name());
  else
    ret_val = shcore::Cpp_object_bridge::get_member(prop);
  return ret_val;
}

std::string &Base_cluster::append_descr(std::string &s_out, int UNUSED(indent),
                                        int UNUSED(quote_strings)) const {
  s_out.append("<" + class_name() + ":" + base_impl()->get_name() + ">");
  return s_out;
}

void Base_cluster::append_json(shcore::JSON_dumper &dumper) const {
  dumper.start_object();
  dumper.append_string("class", class_name());
  dumper.append_string("name", base_impl()->get_name());
  dumper.end_object();
}

bool Base_cluster::operator==(const Object_bridge &other) const {
  return class_name() == other.class_name() && this == &other;
}

shcore::Dictionary_t Base_cluster::list_routers(
    const shcore::Option_pack_ref<List_routers_options> &options) {
  // Throw an error if the cluster has already been dissolved
  assert_valid("listRouters");

  auto ret_val = execute_with_pool(
      [&]() {
        return base_impl()->list_routers(options->only_upgrade_required);
      },
      false);

  return ret_val.as_map();
}

void Base_cluster::setup_admin_account(
    const std::string &user,
    const shcore::Option_pack_ref<Setup_account_options> &options) {
  // Throw an error if the cluster has already been dissolved
  assert_valid("setupAdminAccount");

  // split user into user/host
  std::string username, host;
  std::tie(username, host) = validate_account_name(user);

  return execute_with_pool(
      [&]() { base_impl()->setup_admin_account(username, host, *options); },
      false);
}

void Base_cluster::setup_router_account(
    const std::string &user,
    const shcore::Option_pack_ref<Setup_account_options> &options) {
  // Throw an error if the cluster has already been dissolved
  assert_valid("setupRouterAccount");

  // split user into user/host
  std::string username, host;
  std::tie(username, host) = validate_account_name(user);

  return execute_with_pool(
      [&]() { base_impl()->setup_router_account(username, host, *options); },
      false);
}

void Base_cluster::set_routing_option(const std::string &option,
                                      const shcore::Value &value) {
  assert_valid("setRoutingOption");

  return execute_with_pool(
      [&]() { base_impl()->set_routing_option("", option, value); }, false);
}

void Base_cluster::set_routing_option(const std::string &router,
                                      const std::string &option,
                                      const shcore::Value &value) {
  assert_valid("setRoutingOption");

  return execute_with_pool(
      [&]() { base_impl()->set_routing_option(router, option, value); }, false);
}

shcore::Dictionary_t Base_cluster::routing_options(const std::string &router) {
  assert_valid("routingOptions");

  return execute_with_pool(
      [&]() { return base_impl()->routing_options(router); }, false);
}

}  // namespace dba
}  // namespace mysqlsh
