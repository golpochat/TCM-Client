import React from 'react'
import * as moment from 'moment'

function DisplayTable(props) {
    const { records } = props
    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Team</th>
                        <th>Opponent</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        records.map(record => (
                            <tr key={record._id}>
                                <td>{moment(record.date).format('DD-MM-YYYY')}</td>
                                <td>{record.team.name}</td>
                                <td>{record.opponent}</td>
                                <td>{record.result}</td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default DisplayTable
