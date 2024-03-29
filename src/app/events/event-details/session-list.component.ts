import {Component, Input, OnChanges} from "@angular/core";
import {ISession} from "../shared";
import {AuthService} from "../../user/auth.service";
import {VoterService} from "./voter.service";

@Component({
    selector: 'session-list',
    templateUrl: 'session-list.component.html'
})

export class SessionListComponent implements OnChanges {
    @Input() sessions?: ISession[];
    @Input() filterBy: string;
    @Input() sortBy: string = 'votes';
    visibleSession: ISession[] = [];

    constructor(public auth: AuthService, private voterService: VoterService) {
        this.sessions = [{
            id: 1,
            name: 'session name 1',
            presenter: 'session presenter 1',
            duration: 123,
            level: 'session level 1',
            abstract: 'session abstract 1',
            voters: ['session abstract 1'],
        }]
        this.filterBy = ''
    }

    ngOnChanges() {
        if (this.sessions) {
            this.filterSessions(this.filterBy);
            this.sortBy === 'name' ? this.visibleSession.sort((sortByNameAsc)) : this.visibleSession.sort(sortByVotesDesc);
        }
    }

    toggleVote(session: ISession) {
        if (this.userHasVoted(session)) {
            this.voterService.deleteVoter(session, this.auth.currentUser.userName)
        } else {
            this.voterService.addVoter(session, this.auth.currentUser.userName);
        }
        if (this.sortBy === 'votes') {
            this.visibleSession.sort(sortByVotesDesc);
        }
    }

    userHasVoted(session: ISession) {
        return this.voterService.userHasVoted(session,
            this.auth.currentUser.userName);
    }

    filterSessions(filter: string) {
        if (filter === 'all') {
            this.visibleSession = this.sessions?.slice(0) || [];
        } else {
            this.visibleSession = this.sessions?.filter(session => session.level.toLowerCase() === filter) || []
        }
    }
}

function sortByNameAsc(s1: ISession, s2: ISession) {
    if (s1.name > s2.name) return 1
    else if (s1.name === s2.name) return 0
    return -1
}

function sortByVotesDesc(s1: ISession, s2: ISession) {
    return s2.voters.length - s1.voters.length
}
