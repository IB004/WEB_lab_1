<?php
$time_start = microtime(true);

session_start();


//$_POST['x_value']
$x = xCheck($_POST['x_value']);
$y = yCheck($_POST['y_value']);
$r = rCheck($_POST['r_value']);
$time_offset = offsetCheck($_POST['time_offset']);


$point_data = array(
    "date" => date(' H:i    d.m.Y', time() - $time_offset),
    "x" => $x,
    "y" => $y,
    "r" => $r,
    "area_check" => areaCheck($x, $y, $r),
    "work_time" => number_format((microtime(true) - $time_start) * 1000, 5, ".", "")
);


if (!isset($_SESSION["array"])) {
    $_SESSION["array"] = array($point_data);
} else {
    array_unshift($_SESSION["array"], $point_data);
}
$session_array = $_SESSION["array"];

exit(json_encode($session_array));


function xCheck($x):?int
{
    if (is_numeric($x)){
        $value = (int)$x;
        if (is_int($value) & $value>=-3 & $value<=5){
            return $value;
        }
    }
    return null;

    /*
    if (filter_var($x, FILTER_VALIDATE_INT, ["options" => ["min_range" => -3, "max_range" => 5]]) !== false) {
        return $x;
    } else {
        return null;
    }
    */
}

function yCheck($y): ?float
{
    $y = turnCommasToDots($y);
    if (is_numeric($y)){
        $value = (float)$y;
        if (is_float($value) & $value>=-3 & $value<=3){
            return $value;
        }
    }
    return null;

    /*
    $y = turnCommasToDots($y);
    if (filter_var($y, FILTER_VALIDATE_FLOAT, ["options" => ["min_range" => -3, "max_range" => 3]]) !== false) {
        return $y;
    } else {
        return null;
    }
    */
}

function rCheck($r): ?string
{
    $r = turnCommasToDots($r);
    $allow_r = [1, 1.5, 2, 2.5, 3];
    if (in_array($r, $allow_r)) {
        return $r;
    } else {
        return null;
    }
}

function areaCheck($x, $y, $r): string
{
    $in_area_messages = ["Попал!", "В яблочко!", "Точно!"];
    $out_area_messages = ["Мимо!", "В молоко!", "Не попал!"];
    $rand_int = random_int(0, 2);

    if (is_null($x) or is_null($y) or is_null($r)) {
        return "Некорректные данные!";
    }

    if ($x >= 0 and $y >= 0) {
        $l = $x * $x + $y * $y;
        if ($l <= $r * $r) {
            return $in_area_messages[$rand_int];
        } else {
            return $out_area_messages[$rand_int];
        }
    }

    if ($x < 0 and $y > 0) {
        if (($y > $r / 2) or ($x < -$r / 2)) {
            return $out_area_messages[$rand_int];
        }
        if ($y <= $x + ($r / 2)) {
            return $in_area_messages[$rand_int];
        } else {
            return $out_area_messages[$rand_int];
        }
    }

    if ($x <= 0 and $y <= 0) {
        if ($x >= -$r and $y >= -$r) {
            return $in_area_messages[$rand_int];
        } else {
            return $out_area_messages[$rand_int];
        }
    }

    if ($x > 0 and $y < 0) {
        return $out_area_messages[$rand_int];
    }

    return "Не понял..";
}

function offsetCheck($offset): int
{
    return $offset * 60;
}

function turnCommasToDots($str): string
{
    return str_replace(',', '.', $str);
}

/*
$dom = new DOMDocument();
//$dom->loadHTMLFile("index.html");

$str_file = file_get_contents("index.html");
$dom->loadHTML($str_file);


foreach ($session_array as $data) {
    $tr = $dom->createElement("tr", "");
    foreach ($data as $value) {
        $value_to_set = $value;
        if (is_null($value)){
            $value_to_set = "-";
        }
        $td = $dom->createElement("td", $value_to_set);
        $tr->appendChild($td);
    }
    $table = $dom->getElementById("results_table");
    $table->appendChild($tr);
}


$myHtml = $dom->saveHTML();
echo $myHtml;
*/

?>