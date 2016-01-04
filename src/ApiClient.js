import 'isomorphic-fetch';
import querystring from 'querystring';

export default class ApiClient {

  constructor(config) {
    this.clientConfig = config;
    this.host = config.host;
    this.hostPort = config.port;
    this.vpcomApiHost = `http://${this.host}:${this.hostPort}/vpcom/api`;
  }

  config() {
    return {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    };
  }

  async setUserGeo(geoString) {
    let uri = `${this.vpcomApiHost}/geo`;
    let config = {
      method: 'post',
      body: JSON.stringify({geo: geoString}),
      ...this.config()
    };
    return await this.call(uri, config);
  }

  async fetchBalefirePage(splat) {
    let uri = `${this.vpcomApiHost}/balefire/pages/${splat}`;
    let config = {
      method: 'get',
      ...this.config()
    };
    return await this.call(uri, config);
  }

  async fetchCollection(id) {
    let uri = `${this.vpcomApiHost}/collections/${id}`;
    let config = {
      method: 'get',
      ...this.config()
    };
    return await this.call(uri, config);
  }

  async fetchCollections(ids) {
    let qs = JSON.stringify({id: ids});
    let uri = `${this.vpcomApiHost}/collections?${qs}`;
    let config = {
      method: 'get',
      ...this.config()
    };

    return await this.call(uri, config);
  }

  async fetchListings(ids) {
    let qs = JSON.stringify({id: ids});
    let uri = `${this.vpcomApiHost}/listings?${qs}`;
    let config = {
      method: 'get',
      ...this.config()
    };
    return await this.call(uri, config);
  }

  async get(url, opts) {
    let uri = url;
    if (opts)
      uri += `?${querystring.stringify(opts)}`;

    const config = {
      method: 'get',
      ...this.config()
    };
    return await this.call(uri, config);
  }

  async send(resource, postData) {
    const uri = `${this.apiHost}/${resource}${postData._id ? '/' + postData._id : ''}`;
    const method = typeof postData._id !== 'undefined' ? 'put' : 'post';
    const config = {
      method: method,
      body: JSON.stringify(postData),
      ...this.config()
    };
    return await this.call(uri, config);
  }

  async remove(resource, id) {
    const uri = `${this.apiHost}/${resource}/${id}`;
    const config = {
      method: 'delete',
      ...this.config()
    };
    return await this.call(uri, config);
  }

  async call(uri, config) {
    try {
      let response = await fetch(uri, config);
      return await this.handleResponse(response);
    } catch (error) {
      throw error;
    }
  }

  async handleResponse(response) {
    const json = await response.json();
    const location = response.headers.get('location');
    if (location)
      json.location = location;

    if (json.error)
      throw new Error(JSON.stringify(json));

    return json;
  }

}
