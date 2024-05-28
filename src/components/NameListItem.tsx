import { Person } from "@/types";
import PersonFormPart from "./PersonFormPart";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebase";
import { useEffect, useState } from "react";

type Props = {
  person: Person;
  onClickDelete?: () => void;
  onClickUpdate: (e: React.FormEvent<HTMLFormElement>) => void;
  onClickEdit: () => void;
  isEditing: Boolean;
};

const NameListItem = ({
  person,
  onClickDelete,
  onClickUpdate,
  onClickEdit,
  isEditing,
}: Props) => {
  const [photoUrl, setPhotoUrl] = useState("");

  useEffect(() => {
    const getPhotoUrl = async () => {
      if (person.photo) {
        const filePath = `images/${person.photo}`;
        const fileRef = ref(storage, filePath);
        const url = await getDownloadURL(fileRef);
        setPhotoUrl(url);
      } else {
        setPhotoUrl("/no_image_tate.jpg");
      }
    };
    getPhotoUrl();
  }, [person.photo]);

  if (!isEditing) {
    return (
      <li
        id={person.id}
        className="border-solid border-2 border-indigo-600 rounded-lg m-1 flex"
      >
        <div>
          <img src={photoUrl} alt="photo-url" width={200} height={200} />
        </div>
        <div >
          <div>名前： {person.name}</div>
          <div>性別： {person.gender}</div>
          <div>誕生日： {person.birthDate}</div>
          <div>備考： {person.note}</div>
        </div>
        <div>
          <button onClick={onClickDelete} className="border-solid border-2 border-indigo-600 rounded-lg m-1">削除</button>
        </div>
        <div>
          <button onClick={onClickEdit} className="border-solid border-2 border-indigo-600 rounded-lg m-1">編集</button>
        </div>
      </li>
    );
  } else {
    return <PersonFormPart onSubmit={onClickUpdate} person={person} />;
  }
};

export default NameListItem;
