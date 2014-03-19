#!/bin/bash

TESTS=`ls -1 Test*py`

for t in $TESTS
do
  echo $t
  python $t
done

tput bel

