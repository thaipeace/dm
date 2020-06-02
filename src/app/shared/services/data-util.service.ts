import { Injectable } from '@angular/core';
import * as xml2js from 'xml2js';
import { UUID } from 'angular2-uuid';

@Injectable()
export class DataUtilService {

  constructor( ) { }

  convertXmlToJson(xmlString: string): any {
    let res;
    xml2js.parseString(xmlString, { explicitArray: false }, (error, result) => {
      if (error) {
        throw new Error(error);
      } else {
        res = result;
      }
    });
    return res;
  }

  convertXmlToJsonParseAttributes(xmlString: string): any {
    let res;
    xml2js.parseString(xmlString, { explicitArray: false, mergeAttrs: true }, (error, result) => {
      if (error) {
        throw new Error(error);
      } else {
        res = result;
      }
    });
    return res;
  }

  generateUUId() {
    return UUID.UUID();
  }

  replaceParams(data, params) {
    if (!params) return data;

    for (var i = 0; i < params.length; i++) {
      data = data.replace(new RegExp(this.escapeRegExp('{' + i + '}'), 'g'),  params[i]);
    }
    return data;
  }

  escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  };

  wrapObjToOneElementArray(list) {
    if (!list) return [];
    return list.length ? list : [list];
  }

  bindNestedObjToHtmlList(obj) {
    let div = document.createElement('div');
    div.classList.add('container-fluid');
    if (typeof obj === 'string') {
      let p = document.createElement('p');
      div.appendChild(p);
      p.innerHTML = obj;
    } else {
      for (let i=0; i<Object.keys(obj).length; i++) {
        let dl = document.createElement('dl');
        dl.classList.add(...['row', 'mb-0']);
        div.appendChild(dl);
        let label = Object.keys(obj)[i] === '$' ? '' : Object.keys(obj)[i];

        let dt = document.createElement('dt');
        let dtClass = ['no-horizon-padding', 'mb-1'];
        if (!isNaN(parseInt(Object.keys(obj)[i])) || Array.isArray(obj[Object.keys(obj)[i]])) {
          dtClass = ['d-none'];
        } else {
          if (typeof obj[Object.keys(obj)[i]] === 'string' || obj[Object.keys(obj)[i]] === '') {
            dtClass = ['col-4', 'font-weight-normal', ...dtClass];
          } else {
            dtClass = ['col-12', ...dtClass];
          }
        }
        dt.classList.add(...dtClass);
        dl.appendChild(dt);
        dt.innerHTML = label;

        let dd = document.createElement('dd');
        let ddClass = ['no-horizon-padding'];
        if (typeof obj[Object.keys(obj)[i]] === 'string' || obj[Object.keys(obj)[i]] === '') {
          ddClass = ['col-8', ...ddClass];
        } else {
          ddClass = ['col-12', ...ddClass];
        }
        dd.classList.add(...ddClass);
        dt.appendChild(dd);
        if (typeof obj[Object.keys(obj)[i]] === 'string') {
          dd.innerHTML = obj[Object.keys(obj)[i]];
        } else {
          dd.innerHTML = this.bindNestedObjToHtmlList(obj[Object.keys(obj)[i]]);
        }
      }
    }
    return div.outerHTML;
  }

  removeObjectPropertise(obj: any, unwantPropertyItems: any[]): any {
    unwantPropertyItems.forEach(item => {
      let itemArray = item.split('.');
      itemArray.forEach(property => {
        if (itemArray.length === 1) {
          delete obj[property];
        } else {
          itemArray.shift();
          this.removeObjectPropertise(obj[property], [itemArray.join('.')]);
        }
      })
    });

    return obj;
  }  

  removeUnwantKeyObj(obj): any {
    let result = {};
    if (obj.lengh) {
      result = obj;
    } else {
      for (let key in obj) {
        if (obj[key].$) {
          let temp = obj[key].$;
          delete obj[key].$;
          if (temp.length) {
            result[key].data = temp;
          } else {
            for (let tempKey in temp) {
              result[key][tempKey] = temp[tempKey];
            }
          }
        } else {
          result[key] = this.removeUnwantKeyObj(obj[key]); 
        }
      }
    }

    return result;
  }
}
