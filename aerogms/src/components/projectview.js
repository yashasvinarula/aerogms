import React, {Component} from 'react';

class ProjectView extends Component{
    constructor(props){
        super(props);
        
    }

    componentWillMount () {
        window.initMap();
        //window.getBound();
    }

    addPointLayer(){
        window.makePointLayer();
    }

    createNewLayer(){
        window.createNewLayer('point');
    }

    createNewLineLayer(){

    }

    render(){
         return (
             <div>
                <form id="frmUploader" enctype="multipart/form-data" action="/api/fileupload" method="post">
                    <input type="file" name="fileupload" multiple/>
                    <input type="submit" name="submit" id="btnSubmit" value="Upload" />
                    <input style={{marginLeft:5}} type="button" id="btnMakePoint" value="AddPointLayer" onClick={this.addPointLayer}/>
                    <input style={{marginLeft:5}} type="button" id="btnMakePointLayer" value="Add Point Layer" onClick={this.createNewLayer}/>
                    <input style={{marginLeft:5}} type="button" id="btnMakeLineLayer" value="Add Line Layer" onClick={this.createNewLineLayer}/>
                </form>
                <div id="divloader" className="loader">
                    <img src="./images/loader.gif" className="loaderImg"/>
                </div>
             </div>
         )
        }
}

export default ProjectView