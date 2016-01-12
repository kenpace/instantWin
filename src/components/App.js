import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'; // in ECMAScript 6

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    	jobs: [],
      selected: []
    }
  }

  fetchJobs() {
    const token = btoa(unescape(encodeURIComponent("JAVAWEBUSER:LAGN43PG")));
    var franchise_id = 3131;  
    fetch('http://localhost:3000/api/proxy?url=http://sapdev.valpak.com/sap/fmcall/Z_ONPAK_GET_JOBS_FOR_IW?format=json&FRANCHISE_ID=' + franchise_id, {
      headers: {
        Authorization: "Basic " + token
      } 
    }).then((res) => {
      res.json().then((data) => {
        this.setState({
          jobs: data.CT_JOBS_FOR_IW
        })
      })
    })  
  }

  componentDidMount() {
    this.fetchJobs();	
  }

  handleSubmit(e) {
    const token = btoa(unescape(encodeURIComponent("JAVAWEBUSER:LAGN43PG")));
    e.preventDefault();
    fetch('http://localhost:3000/api/proxy?url=http://sapdev.valpak.com/sap/fmcall/Z_ONPAK_UPDATE_IW_FLAG?format=json', {
      headers: {
        Authorization: "Basic " + token
      },
      method: "post",
      body: JSON.stringify({CT_JOBS_AND_IW:this.state.jobs})

    }).then((res) => {
      this.fetchJobs();      
      res.json().then((data) => {
        console.log(data);
        fetch('http://localhost:3000/api/send',{
          headers: {
            "Content-Type": "application/json"
          },
          method: "post",
          body: JSON.stringify({jobs:this.state.jobs})
        })
      })
    })
  }



  onRowSelect(row, isSelected){      
      var selectedRowIndex = this.state.jobs.findIndex(function(job, index){
        if(row.JOB_NBR === job.JOB_NBR) {
          return true;
        }
      }); 
      if(selectedRowIndex > -1) {
        var updatedJobs = this.state.jobs.slice();
        updatedJobs[selectedRowIndex].INSTANT_WIN = isSelected ? "X" : "";
        this.setState({jobs: updatedJobs});
      }
  }
  onSelectAll(isSelected){
      console.log("is select all: " + isSelected);
  }
  

  render() {  	

  	var selectRowProp = {
  		mode: "checkbox",
  		clickToSelect: true,
  		bgColor: "rgb(180,250,180)",
  		onSelect: this.onRowSelect.bind(this),
  		onSelectAll: this.onSelectAll.bind(this)
  	};

    return (
      <form className="instantWinForm" onSubmit={e => this.handleSubmit(e)}>
        <div className="row">
    		  <div className="col-md-12">
				    <BootstrapTable data={this.state.jobs} search={true} pagination={true} striped={true} selectRow={selectRowProp}>
              <TableHeaderColumn dataField="FRANCHISE">ID</TableHeaderColumn>
              <TableHeaderColumn dataField="INSTANT_WIN">Opt-In</TableHeaderColumn>
              <TableHeaderColumn dataField="FRANCHISE_NAME">Name</TableHeaderColumn>
              <TableHeaderColumn isKey={true} dataField="JOB_NBR">Job #</TableHeaderColumn>
              <TableHeaderColumn dataField="MAILDATE">Mail Date</TableHeaderColumn>
              <TableHeaderColumn dataField="PROMO_DESC">Promotional Theme</TableHeaderColumn>
              <TableHeaderColumn dataField="PROMO_START_DATE">Promotion Start</TableHeaderColumn>
              <TableHeaderColumn dataField="PROMO_END_DATE">Promotion End</TableHeaderColumn>
              <TableHeaderColumn dataField="LOF_DLN_DATE">Registration Deadline</TableHeaderColumn>
				    </BootstrapTable>
          </div>
		    </div>        
        <div className="row">
          <div className="col-md-12">
            <p>By sending in this form you agree to the costs associated with participating in the Instant Win promotion.</p>
            <p><strong>A confirmation of your participation will be sent to your email address listed above.</strong></p>
            <p><input type="submit" className="btn btn-primary" value="Submit" /></p>
          </div>
        </div>
      </form>
    );
  }
  
}

export default App;
