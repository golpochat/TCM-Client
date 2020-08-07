import React from 'react'
import './Footer.css'

export default () => {
    return (
        <footer className="bg-success text-white p-3 text-center">
            Copyright &copy; 2020-{new Date().getFullYear()}, Sujan Hossain - X19170602
        </footer>
    )
}
