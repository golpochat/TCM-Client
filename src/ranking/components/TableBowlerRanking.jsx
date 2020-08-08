import React from 'react'

function TableBowlerRanking(props) {
    const records = props.records
    // console.log(records)
    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>Ranking</th>
                        <th>Name</th>
                        <th>Wickets</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        records.sort((w1, w2) => w1.wicket < w2.wicket ? 1 : -1).map((record, count) => (
                            <tr key={record._id.profile}>
                                <td>{count + 1}</td>
                                <td>
                                    {record.profiles.map(profile => (record._id.profile === profile._id && `${profile.first_name} ${profile.last_name}`))}
                                </td>
                                <td>{record.wicket}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TableBowlerRanking
