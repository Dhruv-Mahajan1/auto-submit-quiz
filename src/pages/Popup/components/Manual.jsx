import React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { Button, Grid } from '@mui/material';

class Manual extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formlink: '',
      starting_time: '',
      ending_time: '',
      StartTimeError: false,
      EndTimeError: false,
      SubmitDiabled: true,
      FormLinkError: false,
      AlarmName: '',
    };

    this.handlelinkChange = this.handlelinkChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handletimeChange = this.handletimeChange.bind(this);
    this.handletimeChangeending = this.handletimeChangeending.bind(this);
    this.onreset = this.onreset.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.check = this.check.bind(this);
  }
  handleNameChange = async (event) => {
    var name = event.target.value;
    this.setState({
      AlarmName: name,
    });
  };

  handlelinkChange = async (event) => {
    var link = event.target.value;
    var error = false;
    if (
      link.match('https://forms.gle+') === null &&
      link.match('https://docs.google.com/forms+') === null
    ) {
      error = true;
    }
    await this.setState({
      formlink: link,
      FormLinkError: error,
    });
    this.check();
  };
  handletimeChange = async (event) => {
    var start = event.target.value;
    var error = false;
    var StartTime = new Date(start);
    if (start === '') {
      error = true;
    }
    await this.setState({
      starting_time: start,
      StartTimeError: error,
    });
    if (this.state.ending_time !== '') {
      var endTimeVal = new Date(this.state.ending_time);
      if (StartTime >= endTimeVal) {
        error = true;
        this.setState({
          EndTimeError: error,
        });
      }
    }
    //console.log(error);
    this.check();
  };
  handletimeChangeending = async (event) => {
    var end = event.target.value;
    var error = false;
    var StartTime = new Date(this.state.starting_time);
    var EndTime = new Date(end);
    if (end === '' || EndTime < new Date() || StartTime >= EndTime) {
      error = true;
    }
    await this.setState({
      EndTimeError: error,
      ending_time: end,
    });
    //console.log(error);
    this.check();
  };
  onreset(event) {
    console.log('i am reset');
    this.setState({
      formlink: '',
      starting_time: '',
      ending_time: '',
    });
  }
  check = () => {
    if (
      this.state.EndTimeError === false &&
      this.state.StartTimeError === false &&
      this.state.FormLinkError === false &&
      this.state.ending_time !== '' &&
      this.state.starting_time !== ''
    ) {
      console.log('check is working');
      this.setState({ SubmitDiabled: false });
    } else {
      console.log('check else is working');
      this.setState({ SubmitDiabled: true });
    }
    console.log(this.state.EndTimeError);
    console.log(this.state.StartTimeError);
    console.log(this.state.ending_time);
    console.log(this.state.starting_time);
  };
  onSubmit(event) {
    var link = this.state.formlink;
    var starttime = this.state.starting_time;
    var endtime = this.state.ending_time;
    var StartTimeInMilliseconds = Date.parse(starttime);
    var EndTimeInMilliseconds = Date.parse(endtime);

    console.log('i am submit');

    chrome.storage.sync.set({ start_time: StartTimeInMilliseconds });
    chrome.storage.sync.set({ flink: link });
    chrome.storage.sync.set({ end_time: EndTimeInMilliseconds });
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    now = now.toISOString().slice(0, 16);
    var CurrentDateAndTimeInMilliSeconds = Date.parse(now);
    var StartTimeMilliSeconds = Date.parse(starttime);

    if (StartTimeMilliSeconds - CurrentDateAndTimeInMilliSeconds <= 0) {
      chrome.storage.sync.set({
        DiffBtwStartAndCurrent: 1000,
      });
    } else {
      chrome.storage.sync.set({
        DiffBtwStartAndCurrent:
          StartTimeMilliSeconds - CurrentDateAndTimeInMilliSeconds,
      });
      this.onreset();
    }
    // chrome.storage.sync.set({
    //   DiffBtwStartAndCurrent: Math.abs(
    //     StartTimeMilliSeconds - CurrentDateAndTimeInMilliSeconds
    //   ),
    // });
  }
  render() {
    return (
      <div margin="0">
        <form noValidate autoComplete="off">
          <Box m={1}>
            <TextField
              id="standard-basic"
              label="Alarm Name"
              variant="standard"
              size="large"
              fullWidth
              fontSize="50"
              value={this.state.AlarmName}
              onChange={this.handleNameChange}
            ></TextField>
            <TextField
              id="standard-basic"
              label="Form Link"
              variant="standard"
              size="large"
              fullWidth
              fontSize="50"
              value={this.state.formlink}
              onChange={this.handlelinkChange}
              error={this.state.FormLinkError}
            ></TextField>
          </Box>

          <Grid container style={{ gap: 15 }} justifyContent="center">
            <Grid item></Grid>
            <Grid item>
              <TextField
                size="small"
                id="date"
                label="Start Time"
                type="datetime-local"
                //type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.starting_time}
                onChange={this.handletimeChange}
              />
            </Grid>
            <Grid item>
              <TextField
                size="small"
                id="date"
                label="End Time"
                type="datetime-local"
                InputLabelProps={{
                  shrink: true,
                }}
                value={this.state.ending_time}
                onChange={this.handletimeChangeending}
                error={this.state.EndTimeError}
              />
            </Grid>
          </Grid>

          <Grid container spacing={0} justifyContent="center">
            {/* <BButton name={"Submit"} />
                        <BButton name={"Reset"} reset={this.onreset}
                        /> */}
            <Box m={1} pt={2} display="block">
              <Button variant="contained" onClick={this.onreset}>
                Reset
              </Button>
            </Box>
            <Box m={1} pt={2} display="block">
              <Button
                variant="contained"
                onClick={this.onSubmit}
                disabled={this.state.SubmitDiabled}
              >
                Submit
              </Button>
            </Box>
          </Grid>
        </form>
      </div>
    );
  }
}
export default Manual;
