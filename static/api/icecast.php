<?php


header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

function getMp3StreamTitle($streamingUrl, $interval, $offset = 0, $headers = true) {
    $needle = 'StreamTitle=';

    $ua = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36';

    $opts = [
        'http' => [
            'method' => 'GET',
            'header' => 'Icy-MetaData: 1',
            'user_agent' => $ua
        ]
    ];

    $data = array();

    if(($headers = get_headers($streamingUrl))) {
        foreach ($headers as $h) {
            if (strpos(strtolower($h), 'icy-metaint') !== false && ($interval = explode(':', $h)[1])) {
                break;
            }
        }
    }

    $context = stream_context_create($opts);

    if($stream = fopen($streamingUrl, 'r', false, $context)) {
        $buffer = stream_get_contents($stream, $interval, $offset);
        fclose($stream);


        if(strpos($buffer, $needle) !== false) {
            $title = explode($needle, $buffer)[1];
            $data[0] = substr($title, 1, strpos($title, ';') - 2);
        } else {
            $data[0] = getMp3StreamTitle($streamingUrl, $interval, $offset + $interval, false);
        }
    }
    else {
        throw new Exception("Unable to open stream [{$streamingUrl}]");
    }

    echo json_encode($data);
}

if (!empty($_GET['url'])) {
	getMp3StreamTitle($_GET['url'], 19200);
}

?>