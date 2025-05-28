import React,{useState} from 'react'
import {Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,IconButton,TablePagination, } from "@mui/material"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import { CheckCircle, Cancel } from "@mui/icons-material";

const DataTable = ({columns,rows,onEdit,onDelete,onStatusChange,rowsPerPageOptions=[10,15,25]}) => {
    const [page,setPage] = useState(0);
    const [rowsPerPage,setRowsPerPage] = useState(rowsPerPageOptions[0]);
    const handleChangePage = (event,newPage) =>{
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) =>{
        setRowsPerPage(parseInt(event.target.value,10));
        setPage(0);
    };
    return (
        <div>
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((col)=>(
                                <TableCell key={col.field}><strong>{col.headerName}</strong></TableCell>
                            ))}
                            {(onEdit || onDelete) && <TableCell align="center"><strong>Actions</strong></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.slice(page*rowsPerPage,page*rowsPerPage+rowsPerPage).map((row,rowIndex)=>(
                                <TableRow key={row.id || row._id || rowIndex}>
                                    {columns.map((col)=>(
                                        <TableCell key={col.field}>
                                            {col.type === 'image' ? (
                                                <img 
                                                    src={`http://localhost:4000${row[col.field]}`} 
                                                    alt={row.title || row.name}
                                                    style={{ width: "100px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                                                />
                                            ):col.type === 'status' ? (
                                                <Tooltip title={row.status === "active" ? "Click to mark Closed" : "Click to mark Active"}>
                                                    <IconButton
                                                        onClick={() => onStatusChange(row._id,row.status)}
                                                        color={row.status === "active" ? "success" : "error"}
                                                        >
                                                        {row.status === "active" ? <CheckCircle /> : <Cancel />}
                                                    </IconButton>
                                                </Tooltip>
                                            ):(
                                                row[col.field]
                                            )}
                                            
                                        </TableCell>
                                    ))}
                                    {(onEdit || onDelete) && (
                                        <TableCell align="center">
                                            {onEdit && (
                                                <IconButton color="primary" onClick={()=>onEdit(row)}>
                                                    <EditIcon/>
                                                </IconButton>
                                            )}
                                            {onDelete && (
                                                <IconButton color='error' onClick={()=>onDelete(row.id || row._id)}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} align='center'>
                                    No Data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={rows.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={rowsPerPageOptions}
            />
        </div>
    )
}

export default DataTable