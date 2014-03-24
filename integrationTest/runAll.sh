#!/bin/bash

TESTS=`ls -1 Test*py`

cd ..
make
cd integrationTest

for t in $TESTS
do
  echo $t
  python $t
done

tput bel

