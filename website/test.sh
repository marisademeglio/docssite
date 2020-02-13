echo "Deleting _site and _serve";
rm -rf _site

export DOCSSITE_HISTORY_URL=http://localhost:8181/history
export TRAVIS_TAG=0.1.0
echo "Simulating build $TRAVIS_TAG"

cp test/versions-1.json src/_data/versions.json
npm run build
wait
rm -rf serve
cp -R _site serve

echo "\n\n*******************************************\n"
echo "Go start \nhttp-serve serve -p 8181\n in another terminal"
echo "\n*******************************************\n\n"
echo "Press any key to continue\n\n"

while [ true ] ; do
read -t 3 -n 1
if [ $? = 0 ] ; then
break ;
else
echo "waiting for the keypress"
fi
done

export TRAVIS_TAG=0.2.0
echo "Simulating build $TRAVIS_TAG"
cp test/versions-2.json src/_data/versions.json
npm run build
wait

rm -rf serve
cp -R _site serve

export TRAVIS_TAG=0.3.0
echo "Simulating build $TRAVIS_TAG"
cp test/versions-3.json src/_data/versions.json
npm run build
wait
rm -rf serve
cp -R _site serve