#!/bin/sh

MSGFMT=`dirname $0`

# nl_NL
msgfmt -o ${MSGFMT}/nl_NL/LC_MESSAGES/wjgui.mo ${MSGFMT}/nl_NL/LC_MESSAGES/wjgui.po

echo "Done formatting"
