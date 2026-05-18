// The preloader stays exactly the same
const preloadedImages = [];
const imageList = [
  "images/fims-user1.png",
  "images/fims-user2.png",
  "images/fims-user3.png",
  "images/fims-user4.png",
  "images/fims-user5.png",
];

imageList.forEach((src) => {
  const img = new Image();
  img.src = src;
  preloadedImages.push(img);
});

function setVisibleLinksForState(state) {
  const links = document.querySelectorAll(".fims-graphic-container a.link-hotspot");

  links.forEach((a) => {
    const showOn = (a.dataset.showOn || "").trim(); // e.g. "user1 user2"
    const allowed = showOn.split(/\s+/).filter(Boolean);
    const shouldShow = allowed.includes(state);

    a.classList.toggle("is-visible", shouldShow);

    // Accessibility: keep hidden links out of screen readers + tab order
    if (shouldShow) {
      a.removeAttribute("aria-hidden");
      a.removeAttribute("tabindex");
    } else {
      a.setAttribute("aria-hidden", "true");
      a.setAttribute("tabindex", "-1");
    }
  });
}

function stateFromImageSrc(src) {
  // matches fims-user1.png ... fims-user5.png (and would match user0 too)
  const m = src.match(/fims-user(\d+)\.png$/);
  return m ? `user${m[1]}` : null;
}

// UPGRADED SWAP FUNCTION
function changeImage(newSrc, newAltText) {
  const mainImage = document.getElementById("fims-main-img");

  // 1) Swap the picture
  mainImage.src = newSrc;

  // 2) Swap the alt text for screen readers
  mainImage.alt = newAltText;

  // 3) Show/hide the appropriate href hotspots
  const state = stateFromImageSrc(newSrc);
  setVisibleLinksForState(state || "__none__");
}

// Ensure correct initial state on first page load
document.addEventListener("DOMContentLoaded", () => {
  const img = document.getElementById("fims-main-img");
  const state = img ? stateFromImageSrc(img.getAttribute("src") || "") : null;
  setVisibleLinksForState(state || "__none__");
});


// javascript for GitHub recent activity feed
async function fetchGitHubActivity() {
  const feedContainer = document.getElementById('github-activity-feed');
  
  // Safety check: only run this if the container exists on the current page
  if (!feedContainer) return;

  const owner = 'noaa-nmfs'; // Changed to noaa-nmfs (update if it is actually noaa-fims)
  const repo = 'fims';       

  try {
    // Fetch the latest events from the repository
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/events?per_page=10`);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const events = await response.json();
    
    // Filter for Pull Requests and Pushes
    const relevantEvents = events.filter(event => 
      event.type === 'PullRequestEvent' || event.type === 'PushEvent'
    ).slice(0, 3); // Get the top 3

    feedContainer.innerHTML = ''; // Clear the "Loading..." text

    relevantEvents.forEach(event => {
      let actionText = '';
      let detailText = '';
      let branchName = '';

      if (event.type === 'PullRequestEvent') {
        actionText = `${event.payload.action} pull request`;
        detailText = event.payload.pull_request.title;
        branchName = `#${event.payload.number}`;
      } else if (event.type === 'PushEvent') {
        const commitCount = event.payload.commits.length;
        actionText = `pushed ${commitCount} commit${commitCount > 1 ? 's' : ''} to`;
        detailText = event.payload.commits[0]?.message || 'No commit message';
        branchName = event.payload.ref.replace('refs/heads/', '');
      }

      // Calculate time ago
      const date = new Date(event.created_at);
      const diffHours = Math.floor((new Date() - date) / (1000 * 60 * 60));
      const timeAgo = diffHours > 24 ? `${Math.floor(diffHours/24)}d ago` : `${diffHours}h ago`;

      // Construct the HTML snippet using Bootstrap classes
      const eventHTML = `
        <div class="d-flex align-items-start gap-3 p-3 rounded-3 border border-transparent custom-hover-bg transition-colors">
          <div class="rounded-circle bg-light overflow-hidden flex-shrink-0" style="width: 40px; height: 40px;">
            <img src="${event.actor.avatar_url}" alt="${event.actor.display_login}" class="w-100 h-100 object-fit-cover" />
          </div>
          <div class="flex-grow-1">
            <p class="mb-1 small">
              <span class="text-primary fw-bold">${event.actor.display_login}</span> 
              ${actionText} 
              <span class="text-danger font-monospace fw-bold">${branchName}</span>
            </p>
            <p class="small text-muted mb-0 fst-italic">"${detailText}"</p>
          </div>
          <span class="text-muted fw-medium" style="font-size: 0.7rem;">${timeAgo}</span>
        </div>
      `;
      feedContainer.insertAdjacentHTML('beforeend', eventHTML);
    });

  } catch (error) {
    console.error('Error fetching GitHub activity:', error);
    feedContainer.innerHTML = '<p class="small text-muted p-3">Unable to load recent activity.</p>';
  }
}

// Run the function when the DOM is ready
document.addEventListener('DOMContentLoaded', fetchGitHubActivity);