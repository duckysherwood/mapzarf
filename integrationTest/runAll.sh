#!/bin/bash

TESTS=`ls -1 Test*py`

pushd /appdata/src/mapzarf
make
popd

for t in $TESTS
do
  echo $t
  python $t
done

tput bel

