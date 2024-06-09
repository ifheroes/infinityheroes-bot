<?php

#set the header for json response
header('Content-Type: application/json');

#scan the /exports folder
$directory = "exports/";
$files = scandir($directory);

# exclude subdirs from the scan and filter JSON files
$jsonFiles = array_filter($files, function($file) use ($directory) {
    return is_file($directory . '/' . $file) && pathinfo($file, PATHINFO_EXTENSION) === 'json';
});

# Function to extract the timestamp from the filename
function extractTimestamp($filename) {
    preg_match('/(\d{2}-\d{2}-\d{4}_\d{2}-\d{2}-\d{2})/', $filename, $matches);
    if (!empty($matches)) {
        return DateTime::createFromFormat('m-d-Y_H-i-s', $matches[1])->getTimestamp();
    }
    return 0;
}

# Sort the JSON files by the extracted timestamp, descending
usort($jsonFiles, function($a, $b) {
    return extractTimestamp($b) - extractTimestamp($a);
});

# Prepare the response data
$data = [];
$counter = 0;

foreach ($jsonFiles as $file) {
    $fileData = file_get_contents($directory . '/' . $file);
    $obj = json_decode($fileData);

    $title = $obj->title;
    $text = $obj->text;
    $image = $obj->image;
    $timestamp = extractTimestamp($file);

    $counter++;
    $data[] = [
        'number' => '' . $counter . '',
        'path' => 'https://api.ifheroes.de/v1/news/exports/' . $file,
        'date' => date("d-m-Y", $timestamp),
        'file_id' => date("dmYHis", $timestamp),
        'title' => $title,
        'text' => $text,
        'image' => $image,
    ];
}

echo json_encode($data);
?>