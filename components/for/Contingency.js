/* global window */
import React from "react";
import {createRef} from "react";
import Layout from "../components/Layout";
import {connect} from "react-redux";
import Router from "next/router";
import Link from 'next/link';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import _ from "lodash";
import {API} from "../config";
import axios from "axios";
import Moment from 'react-moment';
import initialize from "../utils/initialize";
import {charDatabase} from "../utils/charDatabase";
import {stages} from "../utils/stages";
import {dropdownOptions} from "../utils/dropdownOptions";
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import dynamic from 'next/dynamic'; // (if using Next.js or use own dynamic loader)
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
);
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw
} from 'draft-js';
import {
  Grid,
  Dropdown,
  Label,
  Form,
  Icon,
  List,
  Header,
  Item,
  Image,
  Segment,
  Search,
  Input,
  Table,
  Container,
  Divider,
  Menu,
  Button,
  Loader,
} from "semantic-ui-react";
import {
  dateFromObjectId,
  formatName,
  charNameOrUniverse,
  formatInfo,
  formatWeight,
  getJudged,
  judgeRating,
  judgeColors,
  judgeTier
} from "../utils/utilityFunctions";

class Contingency extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      editorStateMobile: EditorState.createEmpty(),
      title: '',
      selectedStages: [],
      submittedContSuccess: false,
      contOpponent: '',
      loadingContingency: false,
      selectedJudgment: '',
      editor: false,
      charCont: [],
      submitNewCont: false,
      charDatabase: charDatabase
    };

    this.onEditorChange = this.onEditorChange.bind(this);
  }

    onEditorChange = editorState => this.setState({editorState});

  componentDidMount() {
    this.setState({
      editor: true,
      charCont: this.props.charCont
    });
  }

  submitContingency = (mobile) => {
    axios({
      method: 'POST',
      url: `${API}/api/savecont`,
      headers: {
        authorization: this.props.token
      },
      data: {
        creator: this.props.userProfile._id,
        target: this.props.charTarget,
        opponent: this.state.contOpponent,
        judgment: this.state.selectedJudgment,
        title: this.state.title,
        stages: this.state.selectedStages,
        content: mobile === true ? JSON.stringify(convertToRaw(this.state.editorStateMobile.getCurrentContent())) : JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()))
      }
    }).then(response => {
      this.setState({ submittedContSuccess: true, submitNewCont: false, title: '', selectedStages: [], contOpponent: '', editorState: EditorState.createEmpty() });

    }).catch(err => {
      console.log('err', err)
      throw new Error(err);
    });

  };

  changeOpponent = async (value) => {
    this.setState({loadingContingency: true });

    let resCont = await axios.get(`${API}/api/getcont/` + this.props.charTarget + '?opponent=' + value);
    let charCont = await resCont.data;

    this.setState({ charCont: charCont, loadingContingency: false });

  };

  addStage = (value) => {
    if (_.includes(this.state.selectedStages, value)) {
      return null;
    }

    var joined = this.state.selectedStages.concat(value);
    this.setState({ selectedStages: joined })
  };

  removeStage = (value) => {
    var removed = _.without(this.state.selectedStages, value);
    this.setState({ selectedStages: removed });
  };

  handleSearchChange = (e, {value}) => {
    this.setState({value});
  };

  render() {
    const {editorState, editorStateMobile, editor} = this.state;

    return (
      <React.Fragment>
      {
        this.state.submittedContSuccess && <Message positive icon="icon"><Icon name='download'/>
            <Message.Content>
              <Message.Header>Success!</Message.Header>
              Your contingency has been submitted to moderation. It will be published as soon as it is approved.
            </Message.Content>
          </Message>
      }
      {
        this.state.submitNewCont &&
            <Segment>
              <Segment basic>
                <Grid relaxed='very'>
                  <Grid.Row columns={2}>
                    <Grid.Column verticalAlign='middle'>
                      <Image bordered src={"/static/slights/" + this.props.charTarget + ".png"}/>
                    </Grid.Column>
                    <Grid.Column verticalAlign='middle'>
                      {
                        this.state.contOpponent !== ''
                          ? <Image centered bordered src={"/static/slights/" + this.state.contOpponent + ".png"}/>
                          : <Loader active size='large'>Waiting for opponent...</Loader>
                      }
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                <Divider vertical>VS</Divider>
              </Segment>
              <Form>
                <Form.Field>
                  <label>Which opponent is this contingency for?</label>
                  <Dropdown placeholder='Search for a character...' selection value={this.state.contOpponent} onChange={(e, data) => this.setState({contOpponent: data.value})} search options={dropdownOptions}/>
                </Form.Field>
                <Form.Field>
                  <label>Title</label>
                  <input type="text" value={this.state.title} onChange={e => this.setState({title: e.target.value})}/>
                </Form.Field>
                <Form.Field>
                  {
                    editor
                      ? <Segment>
                          <Editor editorState={editorState} editorStyle={{
                              minHeight: 100
                            }} onEditorStateChange={this.onEditorChange.bind(this)}/>
                        </Segment>
                      : null
                  }
                </Form.Field>
                <Form.Field>
                  <label>What stages would you recommend for this matchup?</label>
                  <Dropdown placeholder='Select a stage...' selection value={this.state.selectedStage} onChange={(e, data) => this.addStage(data.value)} search options={stages}/>
                  <Divider hidden />
                <Image.Group size='small'>
                    {
                      this.state.selectedStages.map(stage => (<Image bordered onClick={() => this.removeStage(stage)} src={'/static/stages/' + stage + '.png'}>
                      </Image>))
                    }
                    </Image.Group>
                </Form.Field>
                <Button positive fluid type='submit' onClick={() => this.submitContingency(false)}>Submit</Button>
              </Form>
            </Segment>
      }
      <Segment>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column textAlign='left'>
              {
                !this.props.isAuthenticated && (
                  <Link prefetch as={`/signin`} href={`/signin`}>
                  <Button primary>
                  Submit New Contingency
                </Button>
              </Link>)
              }

              {
                this.props.isAuthenticated && (<Button primary onClick={() => this.setState({submitNewCont: !this.state.submitNewCont, submittedContSuccess: false })}>Submit New Contingency</Button>
              )
              }
              </Grid.Column>
            <Grid.Column textAlign='right'>
              <Dropdown placeholder='Filter By Character' selection search options={dropdownOptions} onChange={(e, data) => this.changeOpponent(data.value)} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
        {
          this.state.charCont.length ?
          <Item.Group divided>
            {
              this.state.charCont.map(item => (<Item>
                <Item.Image size='tiny' bordered src={"/static/profiles/" + item.opponent + ".png"}/>
                <Item.Content>
                  <Link prefetch as={`/c/${item._id}`} href={`/cont?cont=${item._id}`}>
                  <Item.Header as='a'>{item.title}</Item.Header>
                  </Link>
                  <Item.Description style={{
                      marginTop: -15
                    }}>
                    <Editor toolbarHidden editorState={EditorState.createWithContent(convertFromRaw(JSON.parse(item.content)))} readOnly={true} editorStyle={{
                        maxHeight: 200
                      }}/>
                  </Item.Description>

                  <Item.Extra style={{
                      color: 'black'
                    }}>
                    <Icon color='green' name='check'/>{item.trustCount} users trust this contingency.
                      <Link prefetch as={`/u/${item.creator.username}`} href={`/user?user=${item.creator.username}`}>
                      <span style={{
                        float: 'right',
                        cursor: 'pointer'
                      }}>Posted by <Image avatar src={item.creator.avatar.url}/> {item.creator.username}</span>
                  </Link>
                  </Item.Extra>
                </Item.Content>
              </Item>))
            }
          </Item.Group>
          :
          <React.Fragment>
          <br />
          <Header textAlign='center'>
            No contingencies found...
            <Header.Subheader>How about submitting one?</Header.Subheader>
          </Header>
        <br />
          </React.Fragment>
        }
      </Segment>
    </React.Fragment>);
  }
}

function mapStateToProps(state) {
  return {isAuthenticated: !!state.authentication.token, userProfile: state.user.profile, token: state.authentication.token};
}

export default connect(mapStateToProps, {})(Contingency);
