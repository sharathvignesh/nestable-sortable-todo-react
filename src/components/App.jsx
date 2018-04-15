import React, { Component } from 'react';
import Header from './header'
import Create from './create-task'
import '../styles/App.css'
import 'font-awesome/css/font-awesome.min.css';
import Modal from 'react-responsive-modal';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    margin: `0 auto`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250,
});

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            selectedTask: undefined,
            tasks: [],
            open: false,
            flag: ''
        };
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({
            items,
        });
        console.log(this.state.items)
    }

    onSubmit = (event) => {
        event.preventDefault()
        const singletask = event.target.elements.singletask.value.trim().toLowerCase()
        const id = this.state.items.length;
        if(!singletask) {
            this.setState(() => ({selectedTask: 'Please enter a task!'}))
        } else if(this.state.tasks.indexOf(singletask) > -1) {
            this.setState(() => ({selectedTask: 'This task already exists!'}))
        } else this.setState((prevState) => ({ items: [...prevState.items, {id: `item-${id}`, content: singletask, children: []}] }))
        event.target.elements.singletask.value = ''
    }

    onCloseModal = () => {
        this.setState({ open: false });
    };
    addChildren = (id) => {
        console.log(id)
        this.setState({open: true, flag: id})
    }
    addChild = (event) => {
        event.preventDefault()
        const childId = this.state.flag
        const singletask = event.target.elements.children.value.trim().toLowerCase()
        console.log(childId)
        let nstate = [...this.state.items]
        nstate.map(el => {
            if(el.id == childId) {
             el.children.push(singletask)
            }
        });

        this.setState({items: nstate, open: false})
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <div>
                <Header />
                <Create
                    onSubmit={this.onSubmit}
                />

                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={{width: '300px', margin: '0 auto', textAlign: 'left', color: 'white', paddingLeft: '5px'}}
                            >
                                {this.state.items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                {item.content}
                                                <div style={{textAlign: 'right', paddingRight: '5px'}} onClick={() => this.addChildren(item.id)}><i className="fas fa-plus-circle"></i></div>
                                                <div>
                                                    <Modal open={this.state.open} onClose={this.onCloseModal} little>
                                                        <form onSubmit={this.addChild}>
                                                            <div className="input-field purple-input">
                                                                <span className="task-icon"></span>
                                                                <input type="text" name="children" autoComplete="off" />
                                                            </div>
                                                            <div className="center-text">
                                                                <button type="submit" className="btn btn-rounded btn-outlined purple-btn">Add</button>
                                                            </div>
                                                        </form>
                                                    </Modal>
                                                </div>
                                                {item.children.length > 0 ? item.children.map((child) => (
                                                    <div style={{paddingLeft: '10px'}}><li>{child}</li></div>
                                                )) : null}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}

