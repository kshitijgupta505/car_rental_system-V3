// Load PHPExcel library
require_once 'PHPExcel/Classes/PHPExcel.php';

// Get form data
$username = $_POST['username'];
$password = $_POST['password'];

// Open Excel file
$excel = PHPExcel_IOFactory::load('users.xlsx');
$sheet = $excel->getActiveSheet();

// Check if user exists
$userExists = false;
foreach ($sheet->getRowIterator() as $row) {
    $cellIterator = $row->getCellIterator();
    $cellIterator->setIterateOnlyExistingCells(false);
    $rowValues = [];
    foreach ($cellIterator as $cell) {
        $rowValues[] = $cell->getValue();
    }
    if ($rowValues[0] == $username && $rowValues[1] == $password) {
        $userExists = true;
        break;
    }
}

// If user exists, redirect to Car.html
if ($userExists) {
    header('Location: Car.html');
    exit;
}

// If user does not exist, display error message
echo "Invalid username or password.";
