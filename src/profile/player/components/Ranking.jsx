import React from 'react'
import { Link } from 'react-router-dom'

function Ranking(props) {
    const { records } = props
    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Batsman</th>
                        <th>Bowler</th>
                        <th>Allrounder</th>
                        {/* <th>Action</th> */}
                    </tr>
                </thead>
                <tbody>
                    {
                        records.map(record => (
                            <tr key={record._id}>
                                <td>{record.batsman}</td>
                                <td>{record.bowler}</td>
                                <td>{record.allrounder}</td>
                                {/* <td>
                                    <Link to={`/${isAuth().role}/match-detail/read`} className='btn btn-primary btn-md mr-2'>View</Link>
                                    <Link to={`/${isAuth().role}/match-detail/update`} className='btn btn-warning btn-md mr-2'>Edit</Link>
                                    <Link to={`/${isAuth().role}/match-detail/delete`} className='btn btn-danger btn-md'>Delete</Link>
                                </td> */}
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Ranking
