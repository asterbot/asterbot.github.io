import { useNavigate } from 'react-router-dom';
import { Gitgraph, templateExtend, TemplateName } from '@gitgraph/react';

import './index.css'
import { JSX } from 'react/jsx-runtime';

const processString = (commitString: string) => {
  // Convert string like "Initial Commit" to "initial_commit"
  return (commitString.toLowerCase()).split(" ").join("_")
}


interface HandleClickProps {
    commitString: string;
    navigate: (path: string) => void;
}

const handleClick = ({ commitString, navigate }: HandleClickProps) => {
    const urlLink = "/blogs/" + processString(commitString);
    navigate(urlLink);
};

const useAddCommit = () => {
  const navigate = useNavigate();


  return (branch: { commit: (arg0: { subject: any; renderMessage: (commit: any) => JSX.Element; }) => void; }, commitString: any) => {
      branch.commit({
          subject: commitString,
          renderMessage: (commit) => {
              return (
                  <text
                      className="commit-message"
                      onClick={() => handleClick({ commitString, navigate })}
                      y={20}
                  >
                      {commit.subject}
                  </text>
              );
          },
      });
  };
}

let options = {
  template: templateExtend(TemplateName.Metro, {
    // colors: ["gray", "turquoise", "darkgreen", "yellowgreen", "navy"],
    commit: {
      message: {
        displayAuthor: false,
        displayHash: false,
        display: true,
      },
    },
  }),
};

const CommitGraph = () => {
  const addCommit = useAddCommit()
  return (
    <div className="commit-graph-container">
      <Gitgraph options={options}>
        {(gitgraph) => {
          const main = gitgraph.branch("main");
          addCommit(main, "Initial Commit");

          const cool_stuff = main.branch("CS stuff")
          addCommit(cool_stuff, "Sleep Sort")

          addCommit(cool_stuff, "Fork Bomb");

        }}
      </Gitgraph>
    </div>
      );
};

export default CommitGraph;
