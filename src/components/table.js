import React from 'react';



// props is tableData which is defined in Landing.js
const keyTable = (props)  => {

    // Data
    const dataColumns = props.columns;
    const dataRows = props.rows;


    const tableHeaders = (<thead>
          <tr>
            {dataColumns.map(function(column, index) {
                return      <th key={'mykey' + index}>{column} </th>        ;})}
          </tr>
      </thead>);

    const tableBody = dataRows.map(function(row, i) {
      return (
        <tr key={i}>
          {dataColumns.map(function(column, index) {
            return <td key={index} >{row[column]}</td>; })}
        </tr>); });

    // Decorate with Bootstrap CSS
    return (<table  >
        {tableHeaders}
        <tbody>{tableBody}</tbody>
      </table>) };

export default keyTable;
