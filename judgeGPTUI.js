class JudgeGPTUI
{
    constructor(chatDiv, winnerDiv, subheading, gameOverUI, userInput, courtRoomIdentityGroup, joinHearingButton, audienceDiv, playerListDiv, client) {
        // Define global variables
        this.chatDiv = chatDiv;
        this.winnerDiv = winnerDiv;
        this.subheading = subheading;
        
        this.gameOverUI = gameOverUI;
        this.analysis = analysis;
        this.userInput = userInput;

        //this.typingDiv = typingDiv;

        this.messageUI = new MessageUI(chatDiv);
        this.courtRoomIdentity = new CourtRoomIdentity(courtRoomIdentityGroup, joinHearingButton);


        this.playerListUI = new PlayerList(audienceDiv, playerListDiv);


        this.client = client;// = new JudgeGPT();
        this.client.onStateChange.AddListener(this.messageUI.UpdateChat);

        this.OnMyTurn = this.OnMyTurn.bind(this);
        this.client.onMyTurn.AddListener(this.OnMyTurn);

        this.OnJoinHearing = this.OnJoinHearing.bind(this);
        this.client.onJoinHearing.AddListener(this.OnJoinHearing);

        this.OnNewHearing = this.OnNewHearing.bind(this);
        this.client.onNewHearing.AddListener(this.OnNewHearing);

        this.UpdatePlayerList = this.UpdatePlayerList.bind(this);
        this.client.onUpdatePlayerList.AddListener(this.UpdatePlayerList);

        this.GetNameFromUI = this.GetNameFromUI.bind(this);
        this.courtRoomIdentity.onSetupComplete.AddListener(this.GetNameFromUI);

        this.joinNextHearing = false;


    }

    GetNameFromUI()
    {
        this.client.player.name = this.courtRoomIdentity.playerData.name;
        this.client.player.profileUrl = this.courtRoomIdentity.playerData.profileUrl;
    }


    async Start()
    {
        this.gameOverUI.group.hidden = true;
        this.userInput.group.hidden = true;
        this.analysis.group.hidden = true;
        this.userInput.submitButton.disabled = false;

        this.courtRoomIdentity.Reset();

        if(this.joinNextHearing)
        {
            this.TryJoinHearing();
        }
    }

    OnNewHearing()
    {
        this.Start();
    }

    OnMyTurn(player)
    {
        this.userInput.group.hidden = false;
        this.userInput.inputFeild.value = "";
        this.userInput.inputFeild.placeholder = player.role + " " + player.name;

    }

    TryJoinHearing()
    {
        this.courtRoomIdentity.OnTryJoinHearing();
        this.client.TryJoinHearing(this.courtRoomIdentity.playerData);
    }

    OnJoinHearing(player)
    {
        console.log(player);

        if(player == null)
        {
            this.joinNextHearing = true;
        }else
        {
            this.courtRoomIdentity.OnJoinHearing(player.role);
        }

    }


    TypeIntoInput()
    {
        this.userInput.aiRespondButton.disabled = this.userInput.inputFeild.value.length > 0;
    }

    SubmitTestimony()
    {

        this.userInput.submitButton.disabled = true;
        this.userInput.group.hidden = true;

        this.client.SubmitTestimony(userInput.inputFeild.value);

        this.userInput.aiRespondButton.disabled = false;
    }

    async AiRespond()
    {
        this.userInput.aiRespondButton.disabled = true;
        
        testimonial = await this.judegGPT.AiRespond();

        this.userInput.inputFeild.value = testimonial;
        this.userInput.aiRespondButton.disabled = false;
    }

    async Analysis()
    {
        this.analysis.group.hidden = false;
        this.analysis.button.hidden = true;

        for(var i = 0; i < 2; i++)
        {
            player = await this.server.Analysis(i);
            this.analysis.player[i].innerText = player.role +"\n"+player.testimony + "\n\n" + player.score;
        }

    }

    async DrawConclusion()
    {
        // Disable the submit button
        this.userInput.submitButton.disabled = true;
        this.userInput.group.hidden = true;

        this.server.CreateRuling(); 

        this.server.CreatePunsihment();

        var winner = this.server.DeclareWinner();

        this.winnerDiv.innerText = "Winner: " + winner.role;
        this.winnerDiv.classList.add(winner.class);

        this.analysis.group.hidden = false;
        this.gameOverUI.group.hidden = false;
    }

    UpdatePlayerList(playerList)
    {
        this.playerListUI.CreateAudience(playerList.audience);

        var hearingParticipants = playerList.players;
        hearingParticipants[0] = playerList.judge;
        this.playerListUI.CreatePlayerList(hearingParticipants);
        //do same for playerlist
    }

    UpdateChat()
    {

    }
}

class PlayerList
{
    constructor(audienceDiv, playerListDiv)
    {
        this.audienceDiv = audienceDiv;
        this.playerListDiv = playerListDiv;
    }

    CreateAudience(audienceList)
    {
        console.log(audienceList);
        this.audienceDiv.innerText = Object.keys(audienceList).length;

    }
        /*this.audienceDiv.innerHTML = "";

        for (var key in audienceList) {
            if (audienceList.hasOwnProperty(key)) {
                this.audienceDiv.appendChild(this.CreateAudienceMember(audienceList[key]));
            }
        }

    }

    CreateAudienceMember(audienceMember)
    {
        var profileImg = document.createElement('img');
        profileImg.classList.add("rounded-circle");
        profileImg.style = "width:80%; margin:0%";
        profileImg.src = audienceMember.profileUrl;


        var nameDiv = document.createElement('div');
        nameDiv.style = "font-size:10px"
        nameDiv.innerText = audienceMember.name;

        var center = document.createElement('center');
        center.style = "margin:5px;";
        center.appendChild(profileImg);
        center.appendChild(nameDiv);

        var card = document.createElement('div');
        card.classList.add("card");
        card.style = "margin:1px";
        card.appendChild(center);

        var groupDiv = document.createElement('div');
        groupDiv.classList.add("col-3");
        groupDiv.style = "padding:0";
        groupDiv.appendChild(card);

        return groupDiv;
    }*/

    CreatePlayerList(playerList)
    {
        console.log(playerList);
        this.playerListDiv.innerHTML = "";

        for (var key in playerList) {
            if (playerList.hasOwnProperty(key) && playerList[key].name != "") {
                this.playerListDiv.appendChild(this.CreatePlayerListMember(playerList[key]));
            }
        }

    }

    CreatePlayerListMember(playerMember)
    {
        var profileImg = document.createElement('img');
        profileImg.classList.add("rounded-circle");
        profileImg.style = "width:80%; margin:0%";
        profileImg.src = playerMember.profileUrl;



        var roleDiv = document.createElement('div');
        roleDiv.style = "font-size:10px"
        roleDiv.innerText = playerMember.role;
        
        var nameDiv = document.createElement('div');
        nameDiv.style = "font-size:10px"
        nameDiv.innerText = playerMember.name;

        var center = document.createElement('center');
        center.style = "margin:5px;";
        center.appendChild(profileImg);
        center.appendChild(roleDiv);
        center.appendChild(nameDiv);

        var card = document.createElement('div');
        card.classList.add("card");
        card.style = "margin:1px";
        card.appendChild(center);

        var groupDiv = document.createElement('div');
        groupDiv.classList.add("col-3");
        groupDiv.style = "padding:0";
        groupDiv.appendChild(card);

        return groupDiv;
    }
}

class CourtRoomIdentity
{
    constructor(courtRoomIdentity, joinHearingButton){


        this.playerData = {};

        this.playerData.profileUrl = GetRandomProfileImage();
        // = RandomLines.GetRandomName();
        this.playerData.name = "";

        this.groupDiv = courtRoomIdentity;
        this.joinHearingButton = joinHearingButton;

        this.profileImg = document.createElement('img');
        this.profileImg.classList.add("rounded-circle");
        this.profileImg.style = "width:60%;margin:20px";
        this.profileImg.src = this.playerData.profileUrl;

        this.nameInput = document.createElement('input');
        this.nameInput.type="text";
        this.nameInput.placeholder=this.playerData.name;
        this.nameInput.style = "width:60%;margin:20px";
        this.nameInput.oninput=() => {
            this.ChangeName();
        };

        this.nameDiv = document.createElement('h5');
        this.nameDiv.innerText = this.playerData.name;
        this.nameDiv.onclick = () => {
            this.EditNameMode(true);
        };


        this.roleDiv = document.createElement('h5');


        this.groupDiv.appendChild(this.profileImg);
        this.groupDiv.appendChild(this.nameInput);
        this.groupDiv.appendChild(this.nameDiv);
        this.groupDiv.appendChild(this.roleDiv);

        this.EditNameMode(false);

        this.Reset();
        this.RandomName();

        this.onSetupComplete = new CallBack();
    }

    async RandomName()
    {
        const response = await fetch('https://brennan.games:3000/RandomName', 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        // Parse response data
        const data = await response.json();
        this.playerData.name = data.name;
        this.nameInput.placeholder=this.playerData.name;
        this.nameDiv.innerText = this.playerData.name;

        this.onSetupComplete.Invoke();
    }

    Reset()
    {
        this.roleDiv.innerText = "Audience";
        this.joinHearingButton.disabled = false;
        this.joinHearingButton.hidden = false;
    }

    EditNameMode(isEditing)
    {
        this.nameInput.hidden = !isEditing;
        this.nameDiv.hidden = isEditing;
    }

    ChangeName()
    {
        this.playerData.name = this.nameInput.value;
        this.nameDiv.innerText = this.playerData.name;
    }

    OnTryJoinHearing()
    {
        this.roleDiv.innerText = "Joining Hearing";
    }

    OnJoinHearing(role)
    {
        this.UpdateRole(role);

    }

    UpdateRole(role)
    {
        this.joinHearingButton.hidden = true;
        console.log(role);
        this.roleDiv.innerText = role;
    }
}

class MessageUI
{
    constructor(chatDiv) {
        this.chatDiv = chatDiv;

        this.messagesDivs = {};

        this.UpdateChat = this.UpdateChat.bind(this);
    }

    UpdateChat(messages)
    {
        this.chatDiv.innerHTML = '';

        for(var i = 0; i < messages.length; i++)
        {
            var consecutive = (i >= 1 && messages[i-1].sender == messages[i].sender);

            this.messagesDivs[i] = new ChatLineUI(messages[i], (i % 2 == 0), consecutive);

            this.chatDiv.appendChild(this.messagesDivs[i].groupDiv);
        }

    }
}

class ChatLineUI
{
    constructor(message, alt, consecutive) {

        this.message = message;

        this.groupDiv = document.createElement('div');
        this.groupDiv.classList.add("row");
        this.groupDiv.classList.add("message");
        this.groupDiv.classList.add(this.message.sender.class);
        if(alt)
            this.groupDiv.classList.add("alt");

        this.messageContentsDiv = document.createElement('div');
        this.messageContentsDiv.classList.add("col");
        this.messageContentsDiv.classList.add("rounded-3");
        this.messageContentsDiv.innerText = this.message.message;

        this.senderDiv = document.createElement('div');
        this.senderDiv.classList.add("col-2");
        this.senderDiv.classList.add("sender");

        if(!consecutive)
        {
            this.senderDiv.innerText = this.message.sender.role + " "+ this.message.sender.name+": ";
        }

        this.groupDiv.appendChild(this.senderDiv);
        this.groupDiv.appendChild(this.messageContentsDiv);
    }

    GetDiv()
    {
        return groupDiv;
    }
}


