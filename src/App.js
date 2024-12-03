import { useState, useEffect } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-select-dt';
import 'datatables.net-responsive-dt';
import 'datatables.net-dt/css/dataTables.dataTables.min.css';
import jsonData from './jsonData.json';
import './App.css';

DataTable.use(DT);

function App() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [jsonDataSet, setJsonDataSet] = useState(jsonData);
  const [selectedData, setSelectedData] = useState(null);
  const [formData, setFormData] = useState({
    "Name": "",
    "DOB": "",
    "Address": "",
    "City": "",
    "State": "",
    "ZipCode": "",
    "Email Address": "",
    "Phone Number": ""
  })

  const columns = [
    { data: null },
    { data: 'Name' },
    { data: 'DOB' },
    { data: 'Address' },
    { data: 'City' },
    { data: 'State' },
    { data: 'ZipCode' },
    { data: 'Email Address' },
    { data: 'Phone Number' }
  ];

  useEffect(() => {
    const checkboxes = document.querySelectorAll(".row-checkbox");
    checkboxes.forEach((checkbox, index) => {
      checkbox.checked = index === selectedRow;
    });
  }, [selectedRow]);

  const handleChange = (type, value) => {
    let formDataValues = formData;
    formDataValues[type] = value;
    setFormData(formDataValues);
  }

  const applyFilters = (data, filters) => {
    return data.filter((item) =>
      Object.keys(filters).every((key) =>
        filters[key] === "" || String(item[key]).toLowerCase().includes(String(filters[key]).toLowerCase())
      )
    );
  };

  const handleSearch = () => {
    const filteredData = applyFilters(jsonData, formData);
    setJsonDataSet(filteredData);
  }

  const handleCheckboxChange = (rowIndex, data) => {

    setSelectedRow((prevSelectedRow) => (prevSelectedRow === rowIndex ? setSelectedData(null) : setSelectedData(jsonDataSet[rowIndex])));
    setSelectedRow((prevSelectedRow) => (prevSelectedRow === rowIndex ? null : rowIndex));
  };

  return (
    <div className="App">
      <div><h2>Choose a Contact</h2></div>
      <div>
        <div><h3>Search for a Contact</h3></div>
        <div className='seatchFilters'>
          <div className='sectionA'>
            <input type='text' className='sectionAField' placeholder='First Name' onChange={(e) => handleChange('Name', e.target.value)} />
            <input type='text' className='sectionAField' placeholder='Last Name' onChange={(e) => handleChange('Name', e.target.value)} />
            <input type='text' className='sectionAField' placeholder='Date of Birth' onChange={(e) => handleChange('DOB', e.target.value)} onBlur={(e) => handleChange('DOB', e.target.value)} />
            <input type='email' className='sectionAField' placeholder='Email Address' onChange={(e) => handleChange('Email Address', e.target.value)} />
            <input type='number' className='sectionAField' placeholder='Phone Number' onChange={(e) => handleChange('Phone Number', e.target.value)} />
          </div>
          <div className='sectionB'>
            <input type='text' className='FieldB' placeholder='Street Address' onChange={(e) => handleChange('Address', e.target.value)} />
            <input type='text' className='FieldB' placeholder='City' onChange={(e) => handleChange('City', e.target.value)} />
            <input type='text' className='FieldB' placeholder='State' onChange={(e) => handleChange('State', e.target.value)} />
            <input type='text' className='FieldB' placeholder='Zip Code' onChange={(e) => handleChange('ZipCode', e.target.value)} />
          </div>
        </div>
        <div>
          <div className='searchBox'>
            <input type='button' value="Search" onClick={() => handleSearch()} />
          </div>
        </div>
        <div id='dataTable'>
          <DataTable
            data={jsonDataSet}
            columns={columns}
            className="display"
            options={{
              responsive: true,
              select: {
                style: 'single'
              },
              lengthChange: false,
              searching: false,
              ordering: false,
              layout: {
                bottomEnd: 'paging'
              },
              columnDefs: [
                {
                  'targets': 0,
                  'searchable': false,
                  'orderable': false,
                  'render': function (data, type, full, meta) {
                    const rowIndex = meta.row;
                    return `<input type="checkbox" class="row-checkbox" id="checkbox-${rowIndex}" />`;
                  },
                }
              ],
              drawCallback: function () {
                document.querySelectorAll(".row-checkbox").forEach((checkbox, index) => {
                  checkbox.onclick = () => handleCheckboxChange(index, checkbox);
                });
              },
            }}
          >
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>DOB</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>ZipCode</th>
                <th>Email Address</th>
                <th>Phone Number</th>
              </tr>
            </thead>
          </DataTable>
        </div>
      </div>
      {selectedData !== null && <div className='selectedDetails'>
        <div><h2>Selected Contact</h2></div>
        <div>
          Name: {selectedData.Name}
        </div>
        <div>
          Email: {selectedData["Email Address"]}
        </div>
        <div>
          Phone: {selectedData["Phone Number"]}
        </div>
        <div>
          Address: {selectedData.Address}, {selectedData.City}, {selectedData.State}, {selectedData.ZipCode}
        </div>
      </div>}

    </div>
  );
}

export default App;


