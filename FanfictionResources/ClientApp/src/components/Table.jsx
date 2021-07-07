import React from "react";
import {Table, Button} from 'react-bootstrap'
import { useTable } from "react-table";
import authService from './api-authorization/AuthorizeService'

export function ReactTable({ data, handleDelete, handleUpdateHeaders, handleUpdateBook,handleRead }) {

    const columns = React.useMemo(
        () => [
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Description',
                accessor: 'description',
            },
            {
                Header: 'Fandom',
                accessor: 'fandom.name',
            },
            {
                Header: 'Tags',
                accessor: 'tags',
                Cell: ({ cell: { value } }) => {
                    const tagList = value.map(x => x.name).join(", ")
                    return <span>{tagList}</span>
                },
            },
            {
                Header: 'Actions',
                accessor: 'actions',
                Cell: ({ cell }) => (
                    <>
                        <Button size='sm' variant="secondary" value={cell.row.values.name} onClick = {handleRead}>
                            Read
                        </Button>
                        <Button size='sm' variant="secondary" value={cell.row.values.name} onClick = {handleUpdateBook}>
                            Edit Book
                        </Button>
                        <Button size='sm' variant="secondary" value={cell.row.values.name} onClick = {handleUpdateHeaders}>
                            Edit Headers
                        </Button>
                        <Button size='sm' variant="secondary" value={cell.row.values.name} onClick = {handleDelete}>
                            Delete
                        </Button>
                    </>
                )
            },
        ],
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data
    });

    return (
        <Table striped bordered hover size="sm">
            <thead>
                {headerGroups.map((group) => (
                    <tr {...group.getHeaderGroupProps()}>
                        {group.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
}