export default () => {
    self.addEventListener("message", event => {
        let [ page, limit, sortOn ] = event.data;
        let apiUrl = `http://localhost:3000/api/products?_page=${page}&_limit=${limit}`;

        if(sortOn && sortOn.length) {
            apiUrl = apiUrl + `&_sort=${sortOn}`;
        }
        fetch(apiUrl).then(res=> res.json()).then(res => {
            self.postMessage(res);
        }).catch(err => {
            self.postMessage(err.message);
        });
    });
  };