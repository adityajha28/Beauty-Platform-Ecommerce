import { useReactTable } from "@tanstack/react-table";

function ProductTable({data}){

const table = useReactTable({data});

return(

<table>

<thead>

<tr>
<th>Name</th>
<th>Price</th>
<th>Stock</th>
</tr>

</thead>

<tbody>

{data.map(product=>(

<tr key={product.id}>

<td>{product.name}</td>
<td>{product.price}</td>
<td>{product.stock}</td>

</tr>

))}

</tbody>

</table>

)

}

export default ProductTable;