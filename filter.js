console.log('Injected');
const ids = [];

const listContainer = document.querySelector('main').children[2].children[1];
const config = { childList: true, subtree: true };
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (const mutation of mutationsList) {
    if (
      mutation.type === 'childList' &&
      mutation.target.classList.contains('occludable-update') &&
      ids.includes(mutation.target.getAttribute('id')) === false
    ) {
      const target = mutation.target;
      const targetId = target.getAttribute('id');
      const parent = target.querySelector(
        '.feed-shared-update-v2__description-wrapper'
      );
      const description = parent?.querySelector('span[dir="ltr"]');
      const text = description?.textContent;

      parent && ids.push(targetId);
      text && filterPostByText(text, target);
    }
  }
};
const observer = new MutationObserver(callback);

observer.observe(listContainer, config);

const postStyle = `
  width: 540px;
  background-color: white;
  padding: 20px;
  margin-block: 10px;
  border-radius: 4px;
`;
const dogApi = 'https://dog.ceo/api/breed/beagle/images/random';
const affirmationApi =
  'https://dulce-affirmations-api.herokuapp.com/affirmation';

function filterPostByText(text, target) {
  const hashtags = [
    '#firstjob',
    '#newjob',
    '#newbeginnings',
    '#newjoinee',
    '#newjobnewlife',
  ];

  const aDiv = document.createElement('div');
  const aImg = document.createElement('img');
  const aP = document.createElement('p');

  if (hashtags.find((hashtag) => text.includes(hashtag))) {
    target.style.filter = 'blur(1px)';

    Promise.all([
      fetch(dogApi).then((res) => res.json()),
      fetch(affirmationApi).then((res) => res.json()),
    ]).then((responses) => {
      const parent = target.parentNode;

      aImg.setAttribute('src', responses[0].message);
      aImg.style.cssText = `
        max-width: 540px;
      `;
      aP.textContent = responses[1][0].phrase;
      aP.style.cssText = `
        text-align: center;
        margin-block: 10px;
      `;

      aDiv.appendChild(aImg);
      aDiv.appendChild(aP);
      
      aDiv.style.cssText = postStyle;
      target.style.filter = '';
      
      parent.appendChild(aDiv);
      parent.children[0].style.display = 'none';
    });
  }
}
