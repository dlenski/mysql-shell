/*
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates. All rights reserved.
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

#ifndef _SHCORE_COMMON_H_
#define _SHCORE_COMMON_H_

#include "mysqlshdk/libs/utils/logger.h"
#include "scripting/types_common.h"

// TODO: This definition should be removed from here
// The one on mysqlshdk_exports.h should be used instead for symbol exports
#define SHCORE_PUBLIC

#ifdef UNUSED
#elif defined(__GNUC__)
#define UNUSED(x) UNUSED_##x __attribute__((unused))
#elif defined(__LCLINT__)
#define UNUSED(x) /*@unused@*/ x
#elif defined(__cplusplus)
#define UNUSED(x)
#else
#define UNUSED(x) x
#endif

#ifdef UNUSED_VARIABLE
#elif defined(__GNUC__)
#define UNUSED_VARIABLE(x) UNUSED_##x __attribute__((unused))
#elif defined(__LCLINT__)
#define UNUSED_VARIABLE(x) /*@unused@*/ x
#else
#define UNUSED_VARIABLE(x) x
#endif

#define MYSH_FULL_VERSION MYSH_VERSION EXTRA_NAME_SUFFIX

namespace shcore {
// A plugin file contains the path, and bool indicating whether it is
// A 1st level plugin (true) or a child plugin (false)
struct Plugin_definition {
  Plugin_definition(const std::string f, bool m) : file(f), main(m) {}
  std::string file;
  bool main;
};
}  // namespace shcore
#endif
