import React, { useState } from "react";
import { Table, Button } from 'react-bootstrap'
import { matchSorter } from 'match-sorter'
import { useFilters, useSortBy, useTable } from "react-table";

export function ReactTable({ data, handleDelete, handleUpdateHeaders, handleUpdateBook, handleRead }) {

    const [filterInput, setFilterInput] = useState("");

    const columns = React.useMemo(
        () => [
            {
                Header: 'Picture',
                accessor: 'pictureUrl',
                disableFilters: true,
                disableSortBy: true,
                Cell: ({ cell: { value } }) => {
                    return (
                        <div style={{ width: 100 }}>
                            <img style={{ width: "100%", margin: "30px 0" }} src={value} />
                        </div>
                    )
                },
            },
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
                disableFilters: true,
                Cell: ({ cell: { value } }) => {
                    const tagList = value.map(x => x.name).join(", ")
                    return <span>{tagList}</span>
                },
            },
            {
                Header: 'Actions',
                accessor: 'actions',
                disableSortBy: true,
                disableFilters: true,
                Cell: ({ cell }) => (
                    <>
                        <Button size='sm' variant="secondary" value={cell.row.values.name} onClick={handleRead}>
                            Read
                        </Button>
                        <Button size='sm' variant="secondary" value={cell.row.values.name} onClick={handleUpdateBook}>
                            Edit Chapters
                        </Button>
                        <Button size='sm' variant="secondary" value={cell.row.values.name} onClick={handleUpdateHeaders}>
                            Edit Book
                        </Button>
                        <Button size='sm' variant="secondary" value={cell.row.values.name} onClick={handleDelete}>
                            Delete
                        </Button>
                    </>
                )
            },
        ],
        []
    )

    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter,
        }),
        []
    )

    const filterTypes = React.useMemo(
        () => ({
            fuzzyText: fuzzyTextFilterFn,
            text: (rows, id, filterValue) => {
                return rows.filter(row => {
                    const rowValue = row.values[id]
                    return rowValue !== undefined
                        ? String(rowValue)
                            .toLowerCase()
                            .startsWith(String(filterValue).toLowerCase())
                        : true
                })
            },
        }),
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        visibleColumns,
    } = useTable(
        {
            columns,
            data,
            defaultColumn,
            filterTypes,
        },
        useFilters,
        useSortBy
    )

    return (
        <>
            <Table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                    <tr>
                        <th
                            colSpan={visibleColumns.length}
                            style={{
                                textAlign: 'left',
                            }}
                        >
                        </th>
                    </tr>
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </>
    )
}

function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
}) {
    const count = preFilteredRows.length

    return (
        <input
            value={filterValue || ''}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            placeholder={`Search ${count} records...`}
        />
    )
}

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

fuzzyTextFilterFn.autoRemove = val => !val