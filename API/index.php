<?php

include 'bd/BD.php';

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, Authorization,X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");


// Verifica si es GET
if($_SERVER['REQUEST_METHOD'] == 'GET'){
    if(isset($_GET['id'])){
        $id = $_GET['id'];
        $query="select * from personas where id= '$id'";
        $resultado=metodoGet($query);
        echo json_encode($resultado->fetch(PDO::FETCH_ASSOC));
    }else{
        $query='select * from personas';
        $resultado=metodoGet($query);
        echo json_encode($resultado->fetchAll());
    }
    header('HTTP/1.1 200 OK');
    exit();
}
// Obtener 1 registro
if($_POST['METHOD'] == 'SEARCH'){
    $id = $_POST['nombre'];
    $query="select * from personas where nombre= '$nombre'";
    $resultado=metodoGet($query);
    echo json_encode($resultado->fetch(PDO::FETCH_ASSOC));
    header('HTTP/1.1 200 OK');
    exit();
}
// verifica si es post
if($_POST['METHOD'] == 'POST'){
    // Subir foto
    //comprueba si ha ocurrido un error

    if ($_FILES['imagen']['error']>0) {
        echo "ha ocurrido un error en la subida";
    } else{
        $permitidos = array("image/jpg","image/jpeg","image/png","image/gif");
        $limite_kb = 10000;
        if (in_array($_FILES['imagen']['type'], $permitidos) && $_FILES['imagen']['size'] <= $limite_kb * 1024) {
            $ruta="fotos/".$_FILES['imagen']['name'];
            if (!file_exists($ruta)) {
                $resultado = @move_uploaded_file($_FILES["imagen"]["tmp_name"], $ruta);
                if ($resultado) {
                    $nombreImg = $_FILES['imagen']['name'];
                            // 
                        unset($_POST['METHOD']);
                        $nombre = $_POST['nombre'];
                        $foto = $nombreImg;
                        $texto = $_POST['texto'];
                        // Creamos la consulta
                        $query="insert into personas(nombre,foto,texto) values ('$nombre','$foto','$texto')";
                        $queryAutoIncrement="select MAX(id) as id from personas";
                        $resultado= metodoPost($query, $queryAutoIncrement);
                        echo json_encode($resultado);
                        header('HTTP/1.1 200 OK');

                        if ($resultado) {
                        echo "Registrado correctamente";
                        } else {
                        die("error");
                        }
                } else{
                    echo "ocurrio un error al mover el archivo";
                }
            } else{
                echo $_FILES['imagen']['name'].", este archivo existe ";
                echo "<br>".$_FILES['imagen']['size'];
                header('HTTP/1.1 400 Bad Request');
            }
        } else {
            echo "Archivo no permitido, este tipo de archivo es prohibido o excede el tamanio de ".$limite_kb." Kilobytes <br>";
            header('HTTP/1.1 400 Bad Request');
        }
}

    exit();
}
// Put
if($_POST['METHOD'] == 'PUT'){
    unset($_POST['METHOD']);
    $id = $_POST['id'];
    $nombre = $_POST['nombre'];
    $foto = $_POST['foto'];
    $texto = $_POST['texto'];
    // Creamos la consulta
    $query="UPDATE personas SET nombre='$nombre',foto='$foto',texto='$texto' WHERE id = '$id' ";
    $resultado= metodoPut($query);
    echo json_encode($resultado);
    header('HTTP/1.1 200 OK');
    exit();
}
// DELETE
if($_POST['METHOD'] == 'DELETE'){
    unset($_POST['METHOD']);
    $id = $_POST['id'];
    // Creamos la consulta
    $query="DELETE FROM personas  WHERE id = '$id' ";
    $resultado= metodoPut($query);
    echo json_encode($resultado);
    header('HTTP/1.1 200 OK');
    exit();
}

header('HTTP/1.1 400 Bad Request');
?>