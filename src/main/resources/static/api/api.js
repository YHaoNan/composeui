function __response_wrapper(promise) {
    return promise.then(res => {
        if (!res.data.successed) throw res.data.errorMsg;
        return res.data;
    })
}
const api = {
    checkIn(name, sid, klass) {
        return __response_wrapper(axios.post(`/checkin/${sid}/${name}/${klass}`));
    },

    getCheckInList(pageNo, pageSize, sid) {
        return __response_wrapper(axios.get(`/checkin/${pageNo}/${pageSize}/${sid}`));
    },

    findAllClasses() {
        return __response_wrapper(axios.get(`/class`));
    },
    findAllClassesNeedCheckIn() {
        return __response_wrapper(axios.get(`/class/needcheckin`));
    },

    addClass(classname) {
        return __response_wrapper(axios.post(`/class/${classname}`));
    },

    setNeedCheckIn(ids) {
        return __response_wrapper(axios.post(`/class/update/${ids}`));
    }
}
