import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

/*
 * 
 * Example data:
  [
    { 
      value: searchText,
      fields: [
        {name: 'item.description', type: 'string'},
        {name: 'item.createTime', type: 'datetime'},
        {name: 'item.triggerIns.templateName', type: 'string'},
        {name: 'item.triggerIns.binding', type: 'objectsArray', showFields: [
          {name: 'paramName', type: 'string'},
          {name: 'paramVal', type: 'string'}
        ]},
        {name: 'item.actionIns.templateName', type: 'string'},
        {name: 'item.actionIns.binding', type: 'objectsArray', showFields: [
          {name: 'paramName', type: 'string'},
          {name: 'paramVal', type: 'string'}
        ]}
      ],
      require: false
    }
  ];

 * 
*/

@Pipe({
  name: 'listBySpecificFields'
})
export class ListBySpecificFieldsPipe implements PipeTransform {

  transform(items: any[], fieldsValuePairs: any, searchText: string): any {
		if (!items) return;
    return items.filter(item => {
  		return fieldsValuePairs.every((pair) => {
	  		if (searchText) {
	  			return pair.fields.some((field) => {
	  				let fieldValue;
	  				switch (field.type) {
							case 'datetime':
								fieldValue = formatDate(eval(field.name), 'yyyy-MM-dd (HH:mm)', 'en').toString();
	  						break;
	  					case 'timestamp':
	  						//fieldValue = $filter('date')(new Date(parseInt(eval(field.name))), 'yyyy-MM-dd (HH:mm)').toString();
	  						break;
  						case 'objectsArray':
  							let fieldValueArray = [];
  							let fields = eval(field.name);
  							for (let i = 0; i<fields.length; i++) {
  								for (let j = 0; j<field.showFields.length; j++) {
									if (field.showFields[j].type === 'datetime') {
										try {
											fieldValueArray.push(
												//$filter('date')(new Date(fields[i][field.showFields[j].name]), 'yyyy-MM-dd (HH:mm)').toString()
											);
										} catch(err) {}
									} else if (field.showFields[j].type === 'timestamp') {
										try {
											fieldValueArray.push(
												//$filter('date')(new Date(parseInt(fields[i][field.showFields[j].name])), 'yyyy-MM-dd (HH:mm)').toString()
											);
										} catch(err) {}
									} else {
										try {
											fieldValueArray.push(fields[i][field.showFields[j].name]);
										} catch(err) {}
									}
  								}
  							};
  							fieldValue = JSON.stringify(fieldValueArray);
							break;
						default:
							try {
								fieldValue = eval(field.name);
							} catch(err) {}
	  				}
					
						let result = false;
						if (fieldValue) {
							if (fieldValue['$']) {
								fieldValue = fieldValue['$'].Value;
							}
							
							result = pair.require ?
								fieldValue.toLowerCase().includes(searchText.toLowerCase()) || searchText.toLowerCase().includes(fieldValue.toLowerCase()) :
								result = fieldValue.toLowerCase().includes(searchText.toLowerCase());
						}
						return result;
		  		});
	  		} else if (!pair.require) {
	  			return true;
	  		} else {
	  			return false;
	  		}
	  	});
  	})
  }

}
