<?php
class Record {
	public $name = "";
	public $id = 0;
}


$con=mysqli_connect("205.178.146.106","czstuff2_chucker","Showdown7","czstuff2_charlottechuckers");
// Check connection
if (mysqli_connect_errno())
  {
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }
$result = mysqli_query($con, "SELECT * FROM records");
$records=array();
while($row = mysqli_fetch_array($result))
  {
	  $playersRound = array();
	  $playersRound[0] = $row[0];
	  $playersRound[1] = $row[1];
	  array_push($records, $playersRound); 
	  
  }
  
$response = $records;
//output the response
echo json_encode($response);

mysqli_close($con);
?>