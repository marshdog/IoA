const LOCAL_DEV = true

const IoAService = (() => {
    if(LOCAL_DEV) {
        return "https://54e9158b.ngrok.io"
    }
    return "https://ioa-service.herokuapp.com" 
})()

export default 
{
    IoAService
}
