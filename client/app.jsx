'use strict';

var React = require('react');
var $ = require('jquery');
var socket = io.connect();
var key = "iavila@elektra.com.mx";
var token = "Gruposalinas327767";
$.ajaxSetup({
  async: true,
	crossDomain: true,
	headers: {
		"accept": "application/vnd.vtex.ds.v10+json",
		"content-type": "application/json",
		"x-vtex-api-appKey": key,
		"x-vtex-api-appToken": token,
    "REST-Range": "resources=0-100"
	}
});

var PushProductApp = React.createClass({
	componentDidMount() {
		socket.on('receive:product', this.productRecieve);
	},
	productRecieve(product) {
		console.log('P', product);
	},
	sendPromo() {
		var promoProduct = {
			sku: document.getElementById('skuEl').value
		};
		socket.emit('send:product', JSON.stringify(promoProduct));
		
		$.ajax({
      method: 'GET',
      url: "https://api.vtex.com/elektra/dataentities/OR/search/?_fields=id,sku,last",
			error: function() {
			var dataP = {
				sku: document.getElementById('skuEl').value,
				last: true
			}

			$.ajax({
				method: 'PATCH',
				url: "https://api.vtex.com/elektra/dataentities/OR/documents/",
				data: JSON.stringify(dataP),
				success: function(data, textStatus, xhr){
				}
			});
			},
      success: function(data, textStatus, xhr){
        if (data.length == 0) {
					var dataP = {
						sku: document.getElementById('skuEl').value,
						last: true
					}

					$.ajax({
						method: 'PATCH',
						url: "https://api.vtex.com/elektra/dataentities/OR/documents/",
						data: JSON.stringify(dataP),
						success: function(data, textStatus, xhr){
						}
					});
        } else {
					var dataP = {
						sku: document.getElementById('skuEl').value,
						last: true
					}
					$.ajax({
						method: 'PUT',
						url: "https://api.vtex.com/elektra/dataentities/OR/documents/" + data[0].id,
						data: JSON.stringify(dataP),
						processData: false,
						success: function(data){
						}
					});
        }
      }
    });
	},
	render() {
		return (
			<div>
				<label>SKU:</label>
				<input id="skuEl" type="text" />

				<br></br>
				<br></br>
				<input type="button" value="Send Promo" onClick={() => this.sendPromo()}/>
			</div>
		);
	}
});

React.render(<PushProductApp/>, document.getElementById('app'));
