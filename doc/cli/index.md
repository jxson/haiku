Usage: haiku <command>

where <command> is one of:
    build, server, init, config, help

haiku <command> -h    help on <command>
haiku help <term>     help on <term>

Specify configs in the ini-formatted file:
    {{ cwd }}/.haikurc
or on the command line via: haiku <command> --key value
Config info can be viewed via: haiku help config

haiku@{{ version }} {{ location }}
