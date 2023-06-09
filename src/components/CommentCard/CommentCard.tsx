import * as Styled from './styles';
import { Comment } from '../../types/types';
import { format } from 'date-fns';
import { useRequest } from '../../hooks/use-request';
import { useContext } from 'react';
import AuthContext from '../../store/auth-context';

const CommentCard = ({
  author,
  body,
  date,
  votes,
  comment_id: id,
  handleDelete,
}: Comment) => {
  const { sendRequest, isError, isLoading } = useRequest();
  const authContext = useContext(AuthContext);

  const { isLoggedIn, userDetails } = authContext;

  const handleBinClick = () => {
    const res = () => {
      handleDelete(id);
    };

    sendRequest('DELETE', `/comments/${id}`, res);
  };

  return (
    <Styled.CommentCard direction="column" gap={0.8}>
      {isError && (
        <Styled.Error>
          Oops, something went wrong. Please try again.
        </Styled.Error>
      )}
      <div>
        <h3>{author}</h3>
        {isLoading && <span>...</span>}

        {isLoggedIn && !isLoading && userDetails.username === author && (
          <Styled.Bin onClick={handleBinClick} />
        )}
      </div>
      <p>{body}</p>
      <div>
        <span>{format(date as Date, 'dd/MM/yyyy')}</span>

        <div>
          <Styled.Votes />
          <span>{votes}</span>
        </div>
      </div>
    </Styled.CommentCard>
  );
};

export default CommentCard;
