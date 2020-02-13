echo "Deleting _site and _serve";
rm -rf _site

export EPUBCHECK_SITE_LIVE_HISTORY=http://localhost:8181/history
echo "Simulating build 0.1.0"

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

echo "Simulating build 0.2.0"
cp test/versions-2.json src/_data/versions.json
npm run build
wait

rm -rf serve
cp -R _site serve

echo "Simulating build 0.3.0"
cp test/versions-3.json src/_data/versions.json
npm run build
wait
rm -rf serve
cp -R _site serve