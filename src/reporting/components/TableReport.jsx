import React from 'react'
import * as moment from 'moment'

function TableReport(props) {
    const records = props.records
    // console.log(records)
    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Reference</th>
                        <th>Payment type</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        records.map(record => (
                            <tr key={record._id}>
                                <td>{moment(record.date).format('DD-MM-YYYY')}</td>
                                <td>{`€${record.amount}`}</td>
                                <td>{record.reference}</td>
                                <td>{record.type}</td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TableReport
