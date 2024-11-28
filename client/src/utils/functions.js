export const isUserPresent = () => {
    const user = JSON.parse(localStorage.getItem('user-data'));

    if(user){
        return true;
    }
    return false;
}