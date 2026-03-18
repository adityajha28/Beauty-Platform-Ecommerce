import { useDropzone } from "react-dropzone";

function ImageUpload({onUpload}){

const {getRootProps,getInputProps}=useDropzone({

onDrop:(files)=>{

onUpload(files[0]);

}

});

return(

<div {...getRootProps()} className="upload-box">

<input {...getInputProps()} />

<p>Drag & Drop Image</p>

</div>

)

}

export default ImageUpload;