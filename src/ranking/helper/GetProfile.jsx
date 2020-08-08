import axios from "axios";

// const GetProfile = (id) => {
//     axios({ method: "GET", url: `${process.env.REACT_APP_API}/get-profile/${id}` })
//         .then((response) => {
//             // console.log(response)
//             response.send(response.data.first_name + ' ' + response.data.last_name);
//         })
//         .catch((error) => {
//             console.log(error)
//         });
// };
// export default GetProfile;


const GetProfile = (id) => {
    axios({ method: "GET", url: `${process.env.REACT_APP_API}/get-profile/${id}` })
        .then(response => {
            if (response) {
                console.log(response.data.first_name)
                return `${response.data.first_name} ${response.data.last_name}`
            }
        })
        .catch(err => console.log(err));
};

export default GetProfile;