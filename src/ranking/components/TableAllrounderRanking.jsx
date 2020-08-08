import React from 'react'

function TableAllrounderRanking(props) {
    const records = props.records
    // console.log(records)
    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>Ranking</th>
                        <th>Name</th>
                        <th>Runs</th>
                        <th>Wickets</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        records.map((record, count) => (
                            <tr key={record._id.profile}>
                                <td>{count + 1}</td>
                                <td>
                                    {record.profiles.map(profile => (record._id.profile === profile._id && `${profile.first_name} ${profile.last_name}`))}
                                </td>
                                <td>{record.run}</td>
                                <td>{record.wicket}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TableAllrounderRanking
