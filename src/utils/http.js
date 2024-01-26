import axios from "axios";
import JSONBIG from "json-bigint"

axios.defaults.baseURL = 'http://localhost:8800';
axios.defaults.timeout = 15000;
axios.defaults.transformResponse = [
    function (data) {
      const json = JSONBIG({
        storeAsString: true
      })
      const res = json.parse(data)
      return res
    }
  ]
axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        alert(JSON.stringify(error), '请求异常', {
            confirmButtonText: '确定',
            callback: (action) => {
                console.log(action);
            }
        });
        return Promise.reject(error);
    }
);

export default {
    /**
     * @param {String} url 
     * @param {Object} data 
     * @returns Promise
     */
    post(url, data) {
        return axios.post(url, data)
            .then(response => {
                console.log(response);
                return response;
            })
            .catch(error => {
                throw error;
            });
    },

    get(url, params) {
        return axios.get(url, { params })
            .then(response => {
                console.log(response);
                return response;
            })
            .catch(error => {
                throw error;
            });
    },

    axios
};
