<?php

#set the header for json response
header('Content-Type: application/json');

#scan the /exports folder
$directory = "exports/";
$files = scandir($directory, SCANDIR_SORT_DESCENDING);

# exclude subdirs from the scan
$jsonFiles = array_filter($files, function($file) use ($directory) {
    return is_file($directory . '/' . $file) && pathinfo($file, PATHINFO_EXTENSION) === 'json';
});

# print out the json files found in export folder
header('Content-Type: application/json');

$data = [];
$counter = 0;

#request for each json file
foreach ($jsonFiles as $file) {
    $counter++;
    $data[] = [
        'number'=>''.$counter.'', # print out counted number
        'path'=>'https://'.$_SERVER['HTTP_HOST'].'/exports/' . $file, # path to file with current url
        'date'=>date("d-m-Y", filectime($directory . '/' . $file)), # get creation date from json file 
        'file_id'=>date("dmYhis", filectime($directory . '/' . $file)), # create an file id out of the date and time
    ];
}

#print response to browser
echo json_encode($data);
?>