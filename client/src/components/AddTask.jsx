import React, { Component } from 'react';
import $ from 'jquery';

export default class AddTask extends Component {
	constructor(props) {
		super(props);
		this.state = {
			//Create a placeholder for the user to enter their input
			userInput: '',
			//place holder to save user input
			list: []
		}
		this.getData = this.getData.bind(this);
	}
	//handle user input
	changeUserInput(input) {
		this.setState({
			userInput: input
		});
	}
	//post method to send data to the server wich will be than transfered to the database
	addTask(task){
		console.log(`New task added: ${task}`);
		$.ajax({
			method: 'POST',
			url: '/tasks',
			contentType: 'application/json',
			data: JSON.stringify({
				task:task
			})
		}).done(() => {
			this.getData();
			this.setState({
				userInput: ''
			})
		});
	}
	// delete
	deleteTask(task){
		console.log(`New task deleted: ${task}`);
		$.ajax({
			url: '/tasks',
			type: 'DELETE',
			contentType: 'application/json',
			data: JSON.stringify({
				task:task
			}),
			success: () => this.getData()
		});
	}
	//gets data from the server that was retrieved from database
	getData(){
		$.ajax({
			url:'/tasks',
			method: 'GET',
			success:(data) => {
				this.setState({list:data});
				console.log(`This is what currently is listed in Database:`, data);
			},
			error:(xhr, err) => {
			console.log('you have an err', err);
			}
		});
	}
	// initial getData
	componentDidMount(){
		console.log('Initial load of DB');
		this.getData();
	}
	// obligatory render method
	render() {
		return (
			<div>
				<div>
					<h1>Task Board</h1>
						<h4>Task Description:
						<input
							placeholder="Enter a new task"
							// handle the user input
							onChange={(e) => this.changeUserInput(e.target.value)}
							// set value to the userInput from state
							value={this.state.userInput}
							type="text"
							onKeyDown={e => {
								if (e.key === 'Enter') {
									console.log('task submitted');
									this.addTask(this.state.userInput);
								}
							}}
						/>
						{/* onClick so when the submit button is clicked the input and be saved */}
						<button onClick={() => {
							console.log('task submitted');
							this.addTask(this.state.userInput);
						}}>Add Task</button>
					</h4>
				</div>
				<br />
				<br />
				<div>
					{/*iterate through list and return it so its displayed*/}
					{this.state.list.map((val, index) => {
						return (<div key={index}><li>{val.task} <button onClick={() => { this.deleteTask(val.task) }}>Done</button></li></div>
						)
					})}
				</div>
			</div>
		);
	}
}